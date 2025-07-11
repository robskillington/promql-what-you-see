# PromQL Learning Quiz 📊

> **🤖 Note:** This application was vibe-coded with AI assistance, with primarily just a few prompts to test this concept.

An interactive React application designed to help you master Prometheus Query Language (PromQL) through hands-on practice with real-time charts and progressive difficulty levels.

## Features ✨

- **Interactive Charts**: See real-time data visualizations from the Prometheus Demo server
- **Progressive Difficulty**: 15 questions across 3 difficulty levels (Easy, Medium, Hard)
- **Smart Hints System**: Get helpful hints when you're stuck
- **Comprehensive Learning**: 
  - Shows metric names and label filters
  - Explains the semantic meaning of each query type
  - Provides links to official PromQL documentation
  - Includes relevant functions and operators for each question
- **Scoring System**: Points based on correct answers with fewer hints
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started 🚀

### Prerequisites

- Node.js 14 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd promql-what-you-see
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use 📚

### Quiz Structure

The quiz is organized into three levels:

1. **Level 1 (Easy)**: Basic metric queries, simple label filters, and fundamental aggregations
2. **Level 2 (Medium)**: Combined functions, grouping, and time-based calculations
3. **Level 3 (Hard)**: Complex queries, percentiles, arithmetic operations, and advanced PromQL features

### Question Format

Each question includes:

- **Chart Visualization**: Real-time data from Prometheus Demo showing the query result
- **Metric Information**: The base metric name and any required label filters
- **Semantic Description**: What the query is trying to accomplish in plain English
- **Relevant Functions**: Links to PromQL documentation for functions used in the question
- **Hint System**: Progressive hints to help you solve the problem
- **Answer Input**: Text area to enter your PromQL query

### Scoring

- **3 points**: Correct answer without using hints
- **2 points**: Correct answer using 1 hint
- **1 point**: Correct answer using 2+ hints
- **0 points**: Incorrect answer

### Example Questions

**Level 1 - Basic Metric Query:**
```promql
prometheus_notifications_total
```

**Level 2 - Rate with Grouping:**
```promql
sum by (handler) (rate(prometheus_http_requests_total[5m]))
```

**Level 3 - Complex Percentage Calculation:**
```promql
sum(rate(prometheus_http_requests_total{code="200"}[5m])) / sum(rate(prometheus_http_requests_total[5m])) * 100
```

## Learning Path 🎯

### Beginner Topics (Level 1)
- Basic metric selection
- Label filtering with `{}`
- Simple aggregations: `sum()`, `avg()`
- Rate calculations: `rate()`

### Intermediate Topics (Level 2)
- Combined functions: `rate()` + `sum()`
- Grouping with `by` clause
- Time-based functions: `increase()`
- Multiple label filters

### Advanced Topics (Level 3)
- Arithmetic operations: `+`, `-`, `*`, `/`
- Histogram functions: `histogram_quantile()`
- Regex matching: `=~`
- Conditional filtering: `>`, `<`
- Complex multi-step queries

## Data Source 📡

The application fetches real-time data from the [Prometheus Demo server](https://prometheus.demo.prometheus.io), which provides:

- Live metrics from a running Prometheus instance
- Various metric types (counters, gauges, histograms)
- Multiple label dimensions
- Time series data for visualization

## Technical Details 🔧

### Architecture

- **Frontend**: React 18 with hooks
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios for API calls
- **Time Handling**: date-fns for time calculations
- **Styling**: Modern CSS with responsive design

### API Integration

The app uses the Prometheus HTTP API:
- **Endpoint**: `https://prometheus.demo.prometheus.io/api/v1/query_range`
- **Parameters**: `query`, `start`, `end`, `step`
- **Response Format**: Prometheus time series data

### Components

- `App.js`: Main application component
- `Quiz.js`: Quiz logic and state management
- `Chart.js`: Chart rendering with Chart.js
- `questions.js`: Question data and metadata
- `prometheusApi.js`: API utilities and data transformation

## Contributing 🤝

We welcome contributions! Here are some ways you can help:

1. **Add Questions**: Create new PromQL questions for any difficulty level
2. **Improve Hints**: Make hints more helpful and educational
3. **UI/UX**: Enhance the user interface and experience
4. **Documentation**: Add more examples and explanations
5. **Bug Fixes**: Report and fix any issues you find

### Adding Questions

To add a new question, edit `src/data/questions.js` and follow this structure:

```javascript
{
  id: 16,
  level: 2,
  title: "Your Question Title",
  description: "What the user should accomplish",
  metricName: "metric_name",
  labelFilters: { label: "value" },
  semanticDescription: "Explain what this query does",
  correctQuery: "your_promql_query",
  queryParams: {
    start: "now-1h",
    end: "now",
    step: "60s"
  },
  relevantFunctions: [
    {
      name: "function_name()",
      description: "What it does",
      documentation: "https://prometheus.io/docs/..."
    }
  ],
  hints: [
    "First hint",
    "Second hint",
    "Final hint"
  ]
}
```

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- [Prometheus](https://prometheus.io) for the amazing monitoring system
- [Prometheus Demo](https://prometheus.demo.prometheus.io) for providing the data source
- [Chart.js](https://www.chartjs.org) for beautiful charts
- [React](https://reactjs.org) for the UI framework

---

Happy learning! 🎉 Master PromQL one query at a time! 