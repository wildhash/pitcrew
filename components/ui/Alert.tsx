import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-blue-900/20 border-blue-500 text-blue-400',
  success: 'bg-green-900/20 border-green-500 text-green-400',
  warning: 'bg-yellow-900/20 border-yellow-500 text-yellow-400',
  error: 'bg-red-900/20 border-red-500 text-red-400',
};

export function Alert({ variant = 'info', title, children, className = '' }: AlertProps) {
  return (
    <div
      className={`
        p-4 border rounded-lg
        ${variantClasses[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {title && <h4 className="font-bold mb-1">{title}</h4>}
      <div>{children}</div>
    </div>
  );
}
