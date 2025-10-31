import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-1">Something went wrong</h3>
                    <p className="text-sm">
                      We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                      <details className="mt-2 text-xs">
                        <summary className="cursor-pointer hover:underline">
                          Technical details
                        </summary>
                        <pre className="mt-1 p-2 bg-red-100 rounded text-red-900 whitespace-pre-wrap">
                          {this.state.error.message}
                        </pre>
                      </details>
                    )}
                  </div>
                  <Button
                    onClick={this.handleRetry}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}