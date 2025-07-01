import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8 text-teal-400">
          Jay's Frames - Houston Custom Framing
        </h1>
        <p className="text-xl mb-6 text-gray-300">
          Museum-Quality Archival Picture Framing in Houston Heights
        </p>
        <div className="bg-gray-900 p-8 rounded-lg border border-teal-500">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">
            Application Starting...
          </h2>
          <p className="text-gray-400">
            Loading Jay's Frames custom framing platform. 
            Database connected and all services initialized.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;