import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-brew-brown-500 text-white hover:bg-brew-brown-600 focus:ring-brew-brown-500',
    secondary: 'bg-brew-gold-500 text-brew-brown-900 hover:bg-yellow-400 focus:ring-brew-gold-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-brew-brown-500 text-brew-brown-600 hover:bg-brew-brown-100 focus:ring-brew-brown-500',
    ghost: 'text-brew-brown-600 hover:bg-brew-brown-100 focus:ring-brew-brown-500',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm',
    md: 'px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base',
    lg: 'px-4 py-2 text-base md:px-6 md:py-3 md:text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
