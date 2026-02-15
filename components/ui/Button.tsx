import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-400',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:bg-gray-800 disabled:text-gray-500',
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 disabled:text-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-700 disabled:text-gray-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded font-semibold transition-colors
        disabled:cursor-not-allowed
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
