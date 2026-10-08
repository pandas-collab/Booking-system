import React from 'react';
import PropTypes from 'prop-types';

class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('API Error Boundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    // Reset error state when children change (successful retry)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
        isRetrying: false
      });
    }
  }

  handleRetry = () => {
    if (this.state.retryCount >= this.props.maxRetries) {
      return;
    }

    this.setState(
      {
        isRetrying: true,
        retryCount: this.state.retryCount + 1
      },
      () => {
        setTimeout(() => {
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            isRetrying: false
          });

          if (this.props.onRetry) {
            this.props.onRetry(this.state.retryCount);
          }
        }, this.props.retryDelay);
      }
    );
  };

  getErrorMessage() {
    const { error } = this.state;
    
    if (!error) return this.props.defaultMessage;

    // Handle different types of API errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return data?.message || 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Authentication required. Please log in and try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 408:
          return 'Request timeout. Please check your connection and try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return data?.message || `Server error (${status}). Please try again.`;
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      return 'Network connection error. Please check your internet connection.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // Generic error message
    return error.message || this.props.defaultMessage;
  }

  getErrorSeverity() {
    const { error } = this.state;
    
    if (!error || !error.response) return 'error';

    const status = error.response.status;
    
    if (status >= 500) return 'error';
    if (status === 429 || status === 408) return 'warning';
    if (status >= 400) return 'info';
    
    return 'error';
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.getErrorMessage();
      const severity = this.getErrorSeverity();
      const canRetry = this.state.retryCount < this.props.maxRetries;
      const showRetry = this.props.enableRetry && canRetry;

      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.handleRetry,
          {
            retryCount: this.state.retryCount,
            maxRetries: this.props.maxRetries,
            canRetry,
            isRetrying: this.state.isRetrying,
            errorMessage,
            severity
          }
        );
      }

      return (
        <div className={`api-error-boundary ${severity}`}>
          <div className="error-content">
            <div className="error-icon">
              {severity === 'error' && '⚠️'}
              {severity === 'warning' && '⚠️'}
              {severity === 'info' && 'ℹ️'}
            </div>
            
            <div className="error-message">
              <h3>Something went wrong</h3>
              <p>{errorMessage}</p>
              
              {this.props.showDetails && this.state.error && (
                <details className="error-details">
                  <summary>Technical Details</summary>
                  <pre>{this.state.error.toString()}</pre>
                  {this.state.errorInfo && (
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  )}
                </details>
              )}
            </div>
            
            <div className="error-actions">
              {showRetry && (
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="retry-button"
                >
                  {this.state.isRetrying ? 'Retrying...' : `Retry (${this.state.retryCount}/${this.props.maxRetries})`}
                </button>
              )}
              
              {this.props.showReload && (
                <button
                  onClick={() => window.location.reload()}
                  className="reload-button"
                >
                  Reload Page
                </button>
              )}
              
              {this.props.onContactSupport && (
                <button
                  onClick={this.props.onContactSupport}
                  className="support-button"
                >
                  Contact Support
                </button>
              )}
            </div>
            
            {this.state.retryCount > 0 && (
              <div className="retry-info">
                Attempt {this.state.retryCount} of {this.props.maxRetries}
              </div>
            )}
          </div>
          
          <style jsx>{`
            .api-error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 200px;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              background-color: #fff;
              border-left: 4px solid #f56565;
            }
            
            .api-error-boundary.warning {
              border-left-color: #ed8936;
            }
            
            .api-error-boundary.info {
              border-left-color: #4299e1;
            }
            
            .error-content {
              text-align: center;
              max-width: 500px;
            }
            
            .error-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            
            .error-message h3 {
              color: #2d3748;
              margin-bottom: 8px;
              font-size: 20px;
            }
            
            .error-message p {
              color: #4a5568;
              margin-bottom: 16px;
              line-height: 1.5;
            }
            
            .error-details {
              margin: 16px 0;
              text-align: left;
            }
            
            .error-details summary {
              cursor: pointer;
              color: #718096;
              font-size: 14px;
            }
            
            .error-details pre {
              background-color: #f7fafc;
              padding: 12px;
              border-radius: 4px;
              font-size: 12px;
              overflow-x: auto;
              margin-top: 8px;
            }
            
            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              flex-wrap: wrap;
            }
            
            .retry-button,
            .reload-button,
            .support-button {
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
            }
            
            .retry-button {
              background-color: #4299e1;
              color: white;
            }
            
            .retry-button:hover:not(:disabled) {
              background-color: #3182ce;
            }
            
            .retry-button:disabled {
              background-color: #a0aec0;
              cursor: not-allowed;
            }
            
            .reload-button {
              background-color: #ed8936;
              color: white;
            }
            
            .reload-button:hover {
              background-color: #dd6b20;
            }
            
            .support-button {
              background-color: #48bb78;
              color: white;
            }
            
            .support-button:hover {
              background-color: #38a169;
            }
            
            .retry-info {
              margin-top: 12px;
              font-size: 12px;
              color: #718096;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

ApiErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  onRetry: PropTypes.func,
  onContactSupport: PropTypes.func,
  enableRetry: PropTypes.bool,
  maxRetries: PropTypes.number,
  retryDelay: PropTypes.number,
  defaultMessage: PropTypes.string,
  showDetails: PropTypes.bool,
  showReload: PropTypes.bool
};

ApiErrorBoundary.defaultProps = {
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  defaultMessage: 'An unexpected error occurred. Please try again.',
  showDetails: process.env.NODE_ENV === 'development',
  showReload: true
};

export { ApiErrorBoundary };