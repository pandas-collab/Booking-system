import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Oops! Something went wrong</h2>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.</p>
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="error-boundary-retry-btn"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="error-boundary-refresh-btn"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
              padding: 20px;
              background-color: #f8f9fa;
            }

            .error-boundary-content {
              max-width: 600px;
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .error-boundary-content h2 {
              color: #dc3545;
              margin-bottom: 16px;
              font-size: 24px;
            }

            .error-boundary-content p {
              color: #6c757d;
              margin-bottom: 24px;
              line-height: 1.5;
            }

            .error-boundary-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-bottom: 24px;
            }

            .error-boundary-retry-btn,
            .error-boundary-refresh-btn {
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.2s;
            }

            .error-boundary-retry-btn {
              background-color: #007bff;
              color: white;
            }

            .error-boundary-retry-btn:hover {
              background-color: #0056b3;
            }

            .error-boundary-refresh-btn {
              background-color: #6c757d;
              color: white;
            }

            .error-boundary-refresh-btn:hover {
              background-color: #545b62;
            }

            .error-boundary-details {
              text-align: left;
              margin-top: 24px;
              padding: 16px;
              background-color: #f8f9fa;
              border-radius: 4px;
            }

            .error-boundary-details summary {
              cursor: pointer;
              font-weight: bold;
              margin-bottom: 12px;
              color: #dc3545;
            }

            .error-boundary-stack {
              background-color: #2d3748;
              color: #e2e8f0;
              padding: 16px;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 12px;
              line-height: 1.4;
              margin: 0;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };