import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Editor } from './components/Editor';
import { ImageRepo } from './components/ImageRepo';
import { Settings } from './components/Settings';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <main className="container mx-auto p-4 mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/editor" replace />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/images" element={<ImageRepo />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
