import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import './SearchBar.css';

const SearchBar = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Search...",
  showHistory = true,
  maxHistoryItems = 10,
  maxSuggestions = 8,
  debounceMs = 300,
  className = "",
  disabled = false,
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((history) => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, []);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        
        // Mock API call - replace with actual API endpoint
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`, {
          signal: abortControllerRef.current.signal
        });
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        } else {
          // Fallback to mock suggestions for demo
          const mockSuggestions = generateMockSuggestions(searchQuery);
          setSuggestions(mockSuggestions);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching suggestions:', error);
          // Fallback to mock suggestions
          const mockSuggestions = generateMockSuggestions(searchQuery);
          setSuggestions(mockSuggestions);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceMs),
    [debounceMs]
  );

  // Generate mock suggestions (fallback)
  const generateMockSuggestions = (searchQuery) => {
    const mockData = [
      'javascript tutorial',
      'react components',
      'node.js backend',
      'css flexbox',
      'python basics',
      'database design',
      'api development',
      'web security'
    ];
    
    return mockData
      .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, maxSuggestions);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      fetchSuggestions(value);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(showHistory && searchHistory.length > 0);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query.trim()) {
      setShowDropdown(true);
    } else if (showHistory && searchHistory.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const items = query.trim() ? suggestions : searchHistory;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < items.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          handleItemSelect(items[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setQuery(item);
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(item);
    } else {
      handleSearch(item);
    }
  };

  // Handle search execution
  const handleSearch = (searchQuery = query) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // Add to search history
    const newHistory = [
      trimmedQuery,
      ...searchHistory.filter(item => item !== trimmedQuery)
    ].slice(0, maxHistoryItems);
    
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
    
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(trimmedQuery);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    saveSearchHistory([]);
    setShowDropdown(false);
  };

  // Remove item from search history
  const removeFromHistory = (itemToRemove, e) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const dropdownItems = query.trim() ? suggestions : searchHistory;
  const showClearButton = query.length > 0;

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-bar__input-container">
        <div className="search-bar__input-wrapper">
          <svg className="search-bar__search-icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            className="search-bar__input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            spellCheck="false"
          />
          
          {isLoading && (
            <div className="search-bar__loading">
              <svg className="search-bar__spinner" viewBox="0 0 24 24" width="16" height="16">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="32">
                  <animate attributeName="stroke-dashoffset" values="32;0;32" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
          )}
          
          {showClearButton && (
            <button
              className="search-bar__clear-button"
              onClick={handleClear}
              type="button"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
        
        <button
          className="search-bar__submit-button"
          onClick={() => handleSearch()}
          type="button"
          disabled={disabled || !query.trim()}
          aria-label="Search"
        >
          Search
        </button>
      </div>

      {showDropdown && (
        <div ref={dropdownRef} className="search-bar__dropdown">
          {dropdownItems.length > 0 ? (
            <>
              {!query.trim() && showHistory && (
                <div className="search-bar__dropdown-header">
                  <span className="search-bar__dropdown-title">Recent Searches</span>
                  <button
                    className="search-bar__clear-history"
                    onClick={clearSearchHistory}
                    type="button"
                  >
                    Clear All
                  </button>
                </div>
              )}
              
              {query.trim() && suggestions.length > 0 && (
                <div className="search-bar__dropdown-header">
                  <span className="search-bar__dropdown-title">Suggestions</span>
                </div>
              )}
              
              <div className="search-bar__dropdown-list">
                {dropdownItems.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className={`search-bar__dropdown-item ${selectedIndex === index ? 'selected' : ''}`}
                    onClick={() => handleItemSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <svg className="search-bar__item-icon" viewBox="0 0 24 24" width="16" height="16">
                      {query.trim() ? (
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                      ) : (
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
                      )}
                    </svg>
                    
                    <span className="search-bar__item-text">{item}</span>
                    
                    {!query.trim() && (
                      <button
                        className="search-bar__remove-item"
                        onClick={(e) => removeFromHistory(item, e)}
                        type="button"
                        aria-label={`Remove ${item} from history`}
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="search-bar__no-results">
              {query.trim() ? 'No suggestions found' : 'No recent searches'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { SearchBar };