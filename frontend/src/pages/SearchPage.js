import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import './SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    products: [],
    articles: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const searchEndpoints = {
    users: '/api/users/search',
    posts: '/api/posts/search',
    products: '/api/products/search',
    articles: '/api/articles/search'
  };

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults({
          users: [],
          posts: [],
          products: [],
          articles: []
        });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchPromises = Object.entries(searchEndpoints).map(
          async ([type, endpoint]) => {
            const response = await fetch(`${endpoint}?q=${encodeURIComponent(searchQuery)}&limit=10`);
            if (!response.ok) {
              throw new Error(`Failed to search ${type}`);
            }
            const data = await response.json();
            return { type, data: data.results || data };
          }
        );

        const searchResults = await Promise.allSettled(searchPromises);
        const newResults = {};

        searchResults.forEach((result, index) => {
          const type = Object.keys(searchEndpoints)[index];
          if (result.status === 'fulfilled') {
            newResults[type] = result.value.data;
          } else {
            newResults[type] = [];
          }
        });

        setResults(newResults);
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const getTotalResults = () => {
    return Object.values(results).reduce((total, items) => total + items.length, 0);
  };

  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return results;
    }
    return { [activeTab]: results[activeTab] };
  };

  const renderUserResult = (user) => (
    <div key={user.id} className="search-result-item">
      <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="user-avatar" />
      <div className="result-content">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        {user.bio && <p className="result-description">{user.bio}</p>}
      </div>
    </div>
  );

  const renderPostResult = (post) => (
    <div key={post.id} className="search-result-item">
      <div className="result-content">
        <h4>{post.title}</h4>
        <p className="result-description">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
        <div className="result-meta">
          <span>By {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  const renderProductResult = (product) => (
    <div key={product.id} className="search-result-item">
      <img src={product.image || '/default-product.png'} alt={product.name} className="product-image" />
      <div className="result-content">
        <h4>{product.name}</h4>
        <p className="result-description">{product.description}</p>
        <div className="result-meta">
          <span className="price">${product.price}</span>
          <span className="category">{product.category}</span>
        </div>
      </div>
    </div>
  );

  const renderArticleResult = (article) => (
    <div key={article.id} className="search-result-item">
      <div className="result-content">
        <h4>{article.title}</h4>
        <p className="result-description">{article.summary || article.content?.substring(0, 150) + '...'}</p>
        <div className="result-meta">
          <span>Published {new Date(article.publishedAt).toLocaleDateString()}</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const filteredResults = getFilteredResults();
    const resultRenderers = {
      users: renderUserResult,
      posts: renderPostResult,
      products: renderProductResult,
      articles: renderArticleResult
    };

    return Object.entries(filteredResults).map(([type, items]) => {
      if (!items.length) return null;

      return (
        <div key={type} className="result-section">
          <h3 className="result-section-title">
            {type.charAt(0).toUpperCase() + type.slice(1)} ({items.length})
          </h3>
          <div className="result-list">
            {items.map(resultRenderers[type])}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search</h1>
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for users, posts, products, articles..."
            className="search-input"
            autoFocus
          />
          {loading && <div className="search-loading">Searching...</div>}
        </div>
      </div>

      {query && (
        <div className="search-filters">
          <button
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Results ({getTotalResults()})
          </button>
          {Object.entries(results).map(([type, items]) => (
            <button
              key={type}
              className={`filter-tab ${activeTab === type ? 'active' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({items.length})
            </button>
          ))}
        </div>
      )}

      <div className="search-results">
        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {!loading && !error && query && getTotalResults() === 0 && (
          <div className="no-results">
            <h3>No results found</h3>
            <p>Try adjusting your search terms or check for typos.</p>
          </div>
        )}

        {!loading && !error && getTotalResults() > 0 && renderResults()}

        {!query && (
          <div className="search-placeholder">
            <h3>Start typing to search</h3>
            <p>Search across users, posts, products, and articles in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;