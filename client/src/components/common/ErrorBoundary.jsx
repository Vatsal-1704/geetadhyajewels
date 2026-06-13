import React from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We encountered an error. Please try refreshing the page or go back.
            </p>
            <div className="error-boundary-actions">
              <button onClick={() => window.location.reload()} className="error-boundary-button">
                Refresh Page
              </button>
              <a href="/" className="error-boundary-link">Go to Home</a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
