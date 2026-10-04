import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Algo salió mal</h2>
            <p className="text-sm text-slate-500 mb-6">
              El módulo experimentó un error inesperado. Hemos registrado el incidente.
            </p>
            
            <div className="bg-slate-50 p-3 rounded text-left text-xs text-red-600 font-mono mb-6 overflow-auto max-h-32">
              {this.state.error?.message || 'Error desconocido'}
            </div>

            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full py-2 px-4 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
