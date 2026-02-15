import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-blue-900/30 text-blue-400 border-blue-500/50',
  success: 'bg-green-900/30 text-green-400 border-green-500/50',
  warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50',
  danger: 'bg-red-900/30 text-red-400 border-red-500/50',
  muted: 'bg-gray-800 text-gray-400 border-gray-600',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-1 text-xs font-medium rounded border
        ${variantClasses[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
}
