import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <div className="w-6 h-px bg-gold-champagne mx-auto mb-8" />
        <h1 className="font-serif font-light text-4xl text-charcoal-900 mb-4">Something went wrong</h1>
        <p className="text-charcoal-500 font-body text-sm max-w-sm leading-relaxed mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-charcoal-900 text-ivory px-8 py-3 text-xs tracking-luxury uppercase font-body hover:bg-charcoal-800 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="border border-charcoal-200 text-charcoal-700 px-8 py-3 text-xs tracking-luxury uppercase font-body hover:border-charcoal-900 transition-colors"
          >
            Go Home
          </a>
        </div>
        {import.meta.env.DEV && this.state.message && (
          <p className="mt-8 text-xs text-red-400 font-mono max-w-lg break-all opacity-60">
            {this.state.message}
          </p>
        )}
      </div>
    );
  }
}
