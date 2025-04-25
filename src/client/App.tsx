import React from 'react';
import MarkdownEditor from './components/MarkdownEditor';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 mb-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold py-4 text-white">Static Site Builder</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4">
        <MarkdownEditor />
      </main>
    </div>
  );
};

export default App;
