import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/apiService';
import { Loader2 } from 'lucide-react';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

// Helper to build a clean query string from filter state
const buildQueryString = (filters) => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category_name', filters.category);
    if (filters.min_price) params.set('min_price', filters.min_price);
    if (filters.max_price) params.set('max_price', filters.max_price);
    if (filters.ordering) params.set('ordering', filters.ordering);
    return params;
};

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    // Initialize filters from the URL to support direct links and refresh
    const initialFilters = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return {
            search: params.get('search') || '',
            category: params.get('category_name') || '',
            min_price: params.get('min_price') || '',
            max_price: params.get('max_price') || '',
            ordering: params.get('ordering') || '-created_at',
        };
    }, []); // Run only on first render

    const [filters, setFilters] = useState(initialFilters);
    const prevFiltersRef = useRef(JSON.stringify(initialFilters));

    // Fetch categories only once
    useEffect(() => {
        categoryService.getCategories()
            .then(res => setCategories(res.data.results || res.data))
            .catch(() => showToast('Could not load categories.', 'error'));
    }, [showToast]);

    // Main data fetching effect
    useEffect(() => {
        const fetchProducts = async () => {
            const currentFiltersString = JSON.stringify(filters);
            // Check if filters have actually changed to reset products and page
            const hasFiltersChanged = prevFiltersRef.current !== currentFiltersString;

            if (hasFiltersChanged) {
                setPage(1); // Reset page to 1 if filters change
                setProducts([]); // Clear old products immediately
                prevFiltersRef.current = currentFiltersString;
                return; // Let the next effect handle the fetch with the new page number
            }

            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            const params = buildQueryString(filters);
            params.set('page', page);

            navigate(`?${params.toString()}`, { replace: true });

            try {
                const response = await productService.getProducts(params);
                const newProducts = response.data.results || [];

                setHasNextPage(response.data.next !== null);

                if (page === 1) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }
            } catch (err) {
                showToast('Could not fetch products.', 'error');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchProducts();
    }, [filters, page, navigate, showToast]);

    const handleLoadMore = () => {
        if (hasNextPage) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar categories={categories} filters={filters} setFilters={setFilters} />
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">{filters.category || 'All Products'}</h2>
                        {!loading && <p className="text-gray-600 text-sm">Showing {products.length} results</p>}
                    </div>



                    {loading && products.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Show an array of skeletons */}
                            {Array.from({ length: 6 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {/* ... (Load More button logic remains the same) ... */}
                        </>
                    ) : (
                        <div className="text-center ...">
                            No products found.
                        </div>
                    )}
                    {/* {loading && page === 1 ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => <ProductCard key={product.id} product={product} />)}
                            </div>
                            {hasNextPage && (
                                <div className="mt-10 text-center">
                                    <button onClick={handleLoadMore} disabled={loadingMore} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center mx-auto min-w-[200px]">
                                        {loadingMore ? <Loader2 className="animate-spin" /> : 'Load More Products'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-10 bg-white rounded-lg"><p className="text-gray-500">No products found.</p></div>
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default HomePage;