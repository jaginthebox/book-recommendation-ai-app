import React from 'react';
import { AuthProvider } from './hooks/useAuth.tsx';
import AppContent from './components/AppContent';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;