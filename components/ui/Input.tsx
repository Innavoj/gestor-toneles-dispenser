
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-brew-brown-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-brew-brown-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-brew-brown-500 focus:border-brew-brown-500 sm:text-sm ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
    