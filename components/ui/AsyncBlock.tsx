import React from 'react';
import { Spinner } from './Spinner';
import { Alert } from './Alert';
import { Button } from './Button';

interface AsyncBlockProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  empty?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  children?: React.ReactNode;
  loadingText?: string;
}

export function AsyncBlock({
  loading = false,
  error = null,
  onRetry,
  empty = false,
  emptyTitle = 'No data available',
  emptyBody = 'There is nothing to display at the moment.',
  children,
  loadingText = 'Loading...',
}: AsyncBlockProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-400">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error">
        <p className="mb-3">{error}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Alert>
    );
  }

  if (empty) {
    return (
      <Alert variant="info" title={emptyTitle}>
        {emptyBody}
      </Alert>
    );
  }

  return <>{children}</>;
}
