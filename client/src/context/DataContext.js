import React, { createContext, useContext, useReducer } from 'react';

const DataContext = createContext();

const initialState = {
  results: null,
  summary: null,
  loading: false,
  error: null
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_RESULTS':
      return { 
        ...state, 
        results: action.payload.results,
        summary: action.payload.summary,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload,
        loading: false
      };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
