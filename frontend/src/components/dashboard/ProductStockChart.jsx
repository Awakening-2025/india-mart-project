// src/components/dashboard/ProductStockChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductStockChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(p => p.name.substring(0, 20) + '...'), // Shorten long names
        datasets: [
            {
                label: 'Stock Quantity',
                data: chartData.map(p => p.stock),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 5 Products by Stock',
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Bar options={options} data={data} />
        </div>
    );
};

export default ProductStockChart;