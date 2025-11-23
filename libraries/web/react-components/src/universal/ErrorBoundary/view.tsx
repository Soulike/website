import {ReactNode} from 'react';

export interface IErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function ErrorBoundary({children, fallback}: IErrorBoundaryProps) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(error);
    return <>{fallback}</>;
  }
}
