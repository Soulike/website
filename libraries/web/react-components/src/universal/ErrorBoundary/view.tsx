import {Component, type ErrorInfo, type ReactNode} from 'react';

export interface IErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  ErrorBoundaryState
> {
  public override state: ErrorBoundaryState = {hasError: false};

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {hasError: true};
  }

  public override componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error(error, info);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}
