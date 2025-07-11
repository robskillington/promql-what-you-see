import React, { useState, useEffect, useCallback } from 'react';
import Chart from './Chart';
import { questions } from '../data/questions';
import { queryPrometheusRange, transformPrometheusDataForChart, parsePrometheusQuery } from '../utils/prometheusApi';

const Quiz = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Query validation states
  const [queryValidation, setQueryValidation] = useState({ valid: false, status: 'empty' });
  const [showQueryError, setShowQueryError] = useState(false);
  
  // User answer chart states
  const [userChartData, setUserChartData] = useState(null);
  const [userChartLoading, setUserChartLoading] = useState(false);
  const [userChartError, setUserChartError] = useState(null);

  // Get current question
  const currentQuestion = questions.find(q => 
    q.level === currentLevel && 
    q.id === getLevelQuestions(currentLevel)[currentQuestionIndex]?.id
  );

  // Get questions for current level
  function getLevelQuestions(level) {
    return questions.filter(q => q.level === level);
  }

  // Load chart data when question changes
  useEffect(() => {
    if (currentQuestion) {
      loadChartData();
    }
  }, [currentQuestion]);

  // Debounced query validation
  const validateQuery = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setQueryValidation({ valid: false, status: 'empty' });
      setUserChartData(null);
      setUserChartError(null);
      return;
    }

    try {
      const validation = await parsePrometheusQuery(query);
      setQueryValidation(validation);
      
      // If query is valid, load user chart data
      if (validation.valid) {
        loadUserChartData(query);
      } else {
        setUserChartData(null);
        setUserChartError(null);
      }
    } catch (error) {
      setQueryValidation({ valid: false, status: 'unknown', error: error.message });
      setUserChartData(null);
      setUserChartError(null);
    }
  }, []);

  // Debounce query validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateQuery(userAnswer);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [userAnswer, validateQuery]);

  const loadChartData = async () => {
    if (!currentQuestion) return;

    setChartLoading(true);
    setChartError(null);

    try {
      const prometheusData = await queryPrometheusRange(
        currentQuestion.correctQuery,
        currentQuestion.queryParams
      );
      
      const chartData = transformPrometheusDataForChart(prometheusData);
      setChartData(chartData);
    } catch (error) {
      setChartError(error.message);
      console.error('Error loading chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const loadUserChartData = async (query) => {
    if (!currentQuestion || !query) return;

    setUserChartLoading(true);
    setUserChartError(null);

    try {
      const prometheusData = await queryPrometheusRange(
        query,
        currentQuestion.queryParams
      );
      
      const chartData = transformPrometheusDataForChart(prometheusData);
      setUserChartData(chartData);
    } catch (error) {
      setUserChartError(error.message);
      console.error('Error loading user chart data:', error);
    } finally {
      setUserChartLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const correct = userAnswer.trim() === currentQuestion.correctQuery;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + Math.max(1, 3 - hintsUsed));
    }
  };

  const handleNextQuestion = () => {
    const levelQuestions = getLevelQuestions(currentLevel);
    
    if (currentQuestionIndex < levelQuestions.length - 1) {
      // Next question in current level
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentLevel < 3) {
      // Next level
      setCurrentLevel(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Quiz complete
      setQuizComplete(true);
    }

    // Reset for next question
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setHintsUsed(0);
    setQueryValidation({ valid: false, status: 'empty' });
    setShowQueryError(false);
    setUserChartData(null);
    setUserChartLoading(false);
    setUserChartError(null);
  };

  const handleUseHint = () => {
    setHintsUsed(prev => prev + 1);
  };

  const resetQuiz = () => {
    setCurrentLevel(1);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setHintsUsed(0);
    setScore(0);
    setQuizComplete(false);
    setQueryValidation({ valid: false, status: 'empty' });
    setShowQueryError(false);
    setUserChartData(null);
    setUserChartLoading(false);
    setUserChartError(null);
  };

  const formatLabelFilters = (filters) => {
    return Object.entries(filters).map(([key, value]) => `${key}="${value}"`).join(', ');
  };

  const getValidationStatus = () => {
    switch (queryValidation.status) {
      case 'valid':
        return {
          icon: '✅',
          text: 'Valid query',
          className: 'validation-valid'
        };
      case 'invalid':
        return {
          icon: '❌',
          text: 'Incomplete or invalid query',
          className: 'validation-invalid'
        };
      case 'unknown':
        return {
          icon: '❓',
          text: 'Unknown query status',
          className: 'validation-unknown'
        };
      default:
        return {
          icon: '⚪',
          text: 'Enter a query',
          className: 'validation-empty'
        };
    }
  };

  if (quizComplete) {
    return (
      <div className="quiz-complete">
        <h2>🎉 Quiz Complete!</h2>
        <p>Your final score: <strong>{score}</strong></p>
        <p>Great job learning PromQL! You've completed all 15 questions across 3 difficulty levels.</p>
        <button onClick={resetQuiz} className="btn btn-primary">
          Start Over
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Loading question...</div>;
  }

  const levelQuestions = getLevelQuestions(currentLevel);
  const progress = ((currentQuestionIndex + 1) / levelQuestions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>PromQL Quiz - Level {currentLevel}</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Question {currentQuestionIndex + 1} of {levelQuestions.length} • Score: {score}
        </p>
      </div>

      <div className="question-section">
        <h2>{currentQuestion.title}</h2>
        <p className="question-description">{currentQuestion.description}</p>
        
        <div className="metric-info">
          <h3>Metric Information</h3>
          <p><strong>Metric Name:</strong> <code>{currentQuestion.metricName}</code></p>
          {Object.keys(currentQuestion.labelFilters).length > 0 && (
            <p><strong>Label Filters:</strong> <code>{formatLabelFilters(currentQuestion.labelFilters)}</code></p>
          )}
          <p><strong>Query Type:</strong> {currentQuestion.semanticDescription}</p>
        </div>

        <div className="chart-section">
          <h3>Chart Result</h3>
          <Chart 
            data={chartData} 
            title={currentQuestion.title}
            loading={chartLoading}
            error={chartError}
          />
        </div>

        <div className="functions-section">
          <h3>Relevant PromQL Functions</h3>
          <div className="functions-list">
            {currentQuestion.relevantFunctions.map((func, index) => (
              <div key={index} className="function-item">
                <strong>{func.name}:</strong> {func.description}
                <a href={func.documentation} target="_blank" rel="noopener noreferrer">
                  📚 Documentation
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="answer-section">
          <h3>Your Answer</h3>
          <div className="answer-input-container">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your PromQL query here..."
              className="answer-input"
              rows="3"
            />
            
            <div className="query-validation">
              <div className={`validation-status ${getValidationStatus().className}`}>
                <span className="validation-icon">{getValidationStatus().icon}</span>
                <span className="validation-text">{getValidationStatus().text}</span>
                
                {queryValidation.status === 'invalid' && (
                  <button
                    className="show-error-btn"
                    onClick={() => setShowQueryError(!showQueryError)}
                    title="Show query error details"
                  >
                    {showQueryError ? 'Hide Error' : 'Show Error'}
                  </button>
                )}
              </div>
              
              {showQueryError && queryValidation.error && (
                <div className="query-error-details">
                  <strong>Error:</strong> {queryValidation.error}
                </div>
              )}
            </div>
          </div>
          
          <div className="button-group">
            <button 
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || showResult}
              className="btn btn-primary"
            >
              Submit Answer
            </button>
            
            {hintsUsed < currentQuestion.hints.length && !showResult && (
              <button 
                onClick={handleUseHint}
                className="btn btn-secondary"
              >
                Use Hint ({hintsUsed + 1}/{currentQuestion.hints.length})
              </button>
            )}
          </div>
        </div>

        {queryValidation.valid && userAnswer.trim() && (
          <div className="user-answer-chart-section">
            <h3>Your Answer Result</h3>
            <Chart 
              data={userChartData} 
              title="Your Query Result"
              loading={userChartLoading}
              error={userChartError}
            />
          </div>
        )}

        {hintsUsed > 0 && (
          <div className="hints-section">
            <h3>Hints</h3>
            {currentQuestion.hints.slice(0, hintsUsed).map((hint, index) => (
              <div key={index} className="hint-item">
                <span className="hint-number">{index + 1}.</span> {hint}
              </div>
            ))}
          </div>
        )}

        {showResult && (
          <div className={`result-section ${isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h3>
            {isCorrect ? (
              <p>Great job! You got it right.</p>
            ) : (
              <div>
                <p>The correct answer is:</p>
                <code className="correct-answer">{currentQuestion.correctQuery}</code>
              </div>
            )}
            <button onClick={handleNextQuestion} className="btn btn-primary">
              {currentLevel === 3 && currentQuestionIndex === levelQuestions.length - 1 
                ? 'Finish Quiz' 
                : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz; 