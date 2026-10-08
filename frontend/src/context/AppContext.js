import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext();

const initialState = {
  loading: false,
  notifications: [],
  user: null,
  theme: 'light',
  sidebar: {
    isOpen: true,
    collapsed: false
  },
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  errors: []
};

const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_USER: 'SET_USER',
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  COLLAPSE_SIDEBAR: 'COLLAPSE_SIDEBAR',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS'
};

const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now() + Math.random(),
          ...action.payload
        }]
      };

    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };

    case actionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload
      };

    case actionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };

    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isOpen: !state.sidebar.isOpen
        }
      };

    case actionTypes.COLLAPSE_SIDEBAR:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          collapsed: action.payload
        }
      };

    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        modal: {
          isOpen: true,
          type: action.payload.type,
          data: action.payload.data || null
        }
      };

    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        modal: {
          isOpen: false,
          type: null,
          data: null
        }
      };

    case actionTypes.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, {
          id: Date.now() + Math.random(),
          ...action.payload
        }]
      };

    case actionTypes.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };

    case actionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };

    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });
    
    if (notification.autoRemove !== false) {
      setTimeout(() => {
        dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: notification.id });
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_NOTIFICATIONS });
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    addNotification({
      type: 'error',
      message,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const setUser = useCallback((user) => {
    dispatch({ type: actionTypes.SET_USER, payload: user });
  }, []);

  const setTheme = useCallback((theme) => {
    dispatch({ type: actionTypes.SET_THEME, payload: theme });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
  }, []);

  const collapseSidebar = useCallback((collapsed) => {
    dispatch({ type: actionTypes.COLLAPSE_SIDEBAR, payload: collapsed });
  }, []);

  const openModal = useCallback((type, data) => {
    dispatch({ type: actionTypes.OPEN_MODAL, payload: { type, data } });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: actionTypes.CLOSE_MODAL });
  }, []);

  const addError = useCallback((error) => {
    dispatch({ type: actionTypes.ADD_ERROR, payload: error });
  }, []);

  const removeError = useCallback((id) => {
    dispatch({ type: actionTypes.REMOVE_ERROR, payload: id });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERRORS });
  }, []);

  const contextValue = {
    ...state,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    setUser,
    setTheme,
    toggleSidebar,
    collapseSidebar,
    openModal,
    closeModal,
    addError,
    removeError,
    clearErrors
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export { AppContext, AppProvider, useApp };