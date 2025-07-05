import React from 'react';
import { AuthProvider } from './hooks/useAuth.tsx';
import AppContent from './components/AppContent';

function App() {
  const { isLoading, results, error, totalResults, processingTime, hasSearched, searchBooks, handleBookClick } = useBookSearch();
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;