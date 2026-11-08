import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render failure:', error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div data-testid="error-boundary-fallback" className="glass-panel rounded-2xl p-8 text-center space-y-4 my-8 max-w-lg mx-auto border-sos-600/40 bg-slate-900/90 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-sos-600/20 text-sos-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Une interruption inattendue est survenue</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            L'application a capturé une erreur d'affichage. Vos données locales et numéros d'urgence restent disponibles.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-sos-600 hover:bg-sos-500 text-white font-bold text-xs inline-flex items-center justify-center space-x-2 transition-all shadow-md shadow-sos-600/20 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recharger l'application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
