import React from 'react';
import { InputProps } from '@/types';
import { clsx } from 'clsx';

export const Input: React.FC<InputProps> = ({
  id,
  type,
  label,
  placeholder,
  error,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm';

  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';

  const classes = clsx(baseClasses, errorClasses, className);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};