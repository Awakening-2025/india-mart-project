// src/components/common/ToasterContainer.jsx

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// 1. Correct the import path for useToast
import { useToast } from '../../context/ToastContext'; // Corrected path
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Configuration for different toast types
const toastConfig = {
    success: { Icon: CheckCircle, barColor: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-50' },
    error: { Icon: XCircle, barColor: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-50' },
    warning: { Icon: AlertTriangle, barColor: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-50' },
    info: { Icon: Info, barColor: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-50' },
};

// Single Toast Item Component (Internal)
// NOTE: `toast` prop ke andar `removeToast` function nahi hai,
//       isliye use `useToast()` hook se get karna sahi hai.
const ToastMessage = ({ toast }) => {
    const { removeToast } = useToast();
    const { Icon, barColor, textColor, bgColor } = toastConfig[toast.type] || toastConfig.info;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`relative flex items-start w-full max-w-sm p-4 mt-4 overflow-hidden rounded-lg shadow-2xl ${bgColor} ${textColor}`}
        >
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${barColor}`}
            />
            <div className="flex-shrink-0 pt-0.5">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 ml-3">
                <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="ml-4 -mt-1 -mr-1 flex-shrink-0 text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
            </button>
        </motion.div>
    );
};

// Main Container Component
const ToasterContainer = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed top-5 right-5 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {toasts.map(toast => (
                    <ToastMessage key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToasterContainer;