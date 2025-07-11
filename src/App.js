import React from 'react';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>PromQL Learning Quiz</h1>
        <p>Master Prometheus Query Language through interactive charts and challenges</p>
      </header>
      
      <main className="app-main">
        <Quiz />
      </main>
      
      <footer className="app-footer">
        <p>
          Data source: <a href="https://prometheus.demo.prometheus.io" target="_blank" rel="noopener noreferrer">
            Prometheus Demo
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App; 