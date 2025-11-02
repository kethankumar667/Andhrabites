import React from 'react';
import { ButtonProps } from '@/types';
import { clsx } from 'clsx';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary-green text-white hover:bg-primary-green/90 focus:ring-primary-green',
    secondary: 'bg-primary-orange text-white hover:bg-primary-orange/90 focus:ring-primary-orange',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-green',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-green',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'opacity-50 cursor-not-allowed': disabled || loading,
      'cursor-pointer': !disabled && !loading,
    },
    className
  );

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};