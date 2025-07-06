import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', actions }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`p-4 border-b border-brew-brown-200 flex justify-between items-center ${titleClassName}`}>
          <h3 className="text-base md:text-lg font-semibold text-brew-brown-700">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={`p-4 md:p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
