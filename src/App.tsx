import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { CombinedJourneyPage } from './pages/CombinedJourneyPage';
import { EntryViewerPage } from './pages/EntryViewerPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { diaryService } from './api/diaryService';

// Protected route guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const session = diaryService.getCurrentSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journey/combined"
          element={
            <ProtectedRoute>
              <CombinedJourneyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journey/:sectionId"
          element={
            <ProtectedRoute>
              <JourneyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/entry/:id"
          element={
            <ProtectedRoute>
              <EntryViewerPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
