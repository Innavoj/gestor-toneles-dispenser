import React from 'react';
import { SelectOption } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({ label, name, options, error, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-brew-brown-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`block w-full px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border ${
          error ? 'border-red-500' : 'border-brew-brown-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-brew-brown-500 focus:border-brew-brown-500 ${className}`}
        {...props}
      >
        <option value="" disabled={props.required}>Select {label?.toLowerCase()}...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
