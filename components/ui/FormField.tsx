import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'textarea' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  children?: React.ReactNode; // For select options
}

export function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helper,
  required = false,
  disabled = false,
  rows = 3,
  children,
}: FormFieldProps) {
  const baseInputClasses = `
    w-full px-3 py-2 bg-gray-800 border rounded
    focus:outline-none focus:border-blue-500
    disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-600'}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={baseInputClasses}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={baseInputClasses}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClasses}
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {helper && !error && <p className="text-sm text-gray-500">{helper}</p>}
    </div>
  );
}
