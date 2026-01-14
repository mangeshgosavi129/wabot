import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-2xl shadow-xl w-full ${sizes[size]} transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
