export const questions = [
  // Level 1: Basic queries (Easy)
  {
    id: 1,
    level: 1,
    title: "Basic Metric Query",
    description: "Show the current number of active Prometheus targets",
    metricName: "prometheus_notifications_total",
    labelFilters: {},
    semanticDescription: "Simple metric value query - get the current total count of Prometheus notifications",
    correctQuery: "prometheus_notifications_total",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Basic metric selection",
        description: "Select a metric by name",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/basics/#instant-vector-selectors"
      }
    ],
    hints: [
      "Start with the metric name exactly as shown above",
      "No functions or operators needed for this basic query",
      "Just use the metric name: prometheus_notifications_total"
    ]
  },
  {
    id: 2,
    level: 1,
    title: "Label Filter Query",
    description: "Get HTTP requests with status code 200",
    metricName: "prometheus_http_requests_total",
    labelFilters: { code: "200" },
    semanticDescription: "Filter a metric by specific label values - get only HTTP requests that returned status 200",
    correctQuery: 'prometheus_http_requests_total{code="200"}',
    queryParams: {
      start: "now-1h",
      end: "now", 
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Label matching",
        description: "Filter metrics by label values",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/basics/#instant-vector-selectors"
      }
    ],
    hints: [
      "Use curly braces {} to add label filters",
      "The label is 'code' and the value is '200'",
      "Format: metric_name{label=\"value\"}"
    ]
  },
  {
    id: 3,
    level: 1, 
    title: "Multiple Label Filters",
    description: "Get HTTP requests to the /api/v1/query endpoint with status 200",
    metricName: "prometheus_http_requests_total",
    labelFilters: { code: "200", handler: "/api/v1/query" },
    semanticDescription: "Filter a metric by multiple label values - get HTTP requests with specific status code and endpoint",
    correctQuery: 'prometheus_http_requests_total{code="200",handler="/api/v1/query"}',
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Multiple label matching",
        description: "Filter by multiple labels using comma separation",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/basics/#instant-vector-selectors"
      }
    ],
    hints: [
      "Use commas to separate multiple label filters",
      "Both 'code' and 'handler' labels need to be specified",
      "Format: metric{label1=\"value1\",label2=\"value2\"}"
    ]
  },
  {
    id: 4,
    level: 1,
    title: "Rate Function Basics",
    description: "Calculate the per-second rate of HTTP requests over 5 minutes",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Rate of change calculation - convert a counter metric to a per-second rate",
    correctQuery: "rate(prometheus_http_requests_total[5m])",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "rate()",
        description: "Calculate per-second rate of increase for counters",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/functions/#rate"
      }
    ],
    hints: [
      "Use the rate() function to calculate per-second rate",
      "Specify a time range in square brackets [5m]",
      "Format: rate(metric_name[time_range])"
    ]
  },
  {
    id: 5,
    level: 1,
    title: "Sum Aggregation",
    description: "Get the total number of HTTP requests across all instances",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Aggregation query - sum up all values across different label dimensions",
    correctQuery: "sum(prometheus_http_requests_total)",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "sum()",
        description: "Sum values across dimensions",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators"
      }
    ],
    hints: [
      "Use the sum() aggregation function",
      "Wrap the metric name inside sum()",
      "Format: sum(metric_name)"
    ]
  },

  // Level 2: Intermediate queries (Medium)
  {
    id: 6,
    level: 2,
    title: "Rate with Label Filters",
    description: "Calculate the per-second rate of successful HTTP requests (status 200) over 5 minutes",
    metricName: "prometheus_http_requests_total",
    labelFilters: { code: "200" },
    semanticDescription: "Combined rate and filtering - get the rate of change for only successful requests",
    correctQuery: 'rate(prometheus_http_requests_total{code="200"}[5m])',
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "rate()",
        description: "Calculate per-second rate of increase",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/functions/#rate"
      }
    ],
    hints: [
      "Combine rate() function with label filtering",
      "Put the label filter inside the rate() function",
      "Format: rate(metric{label=\"value\"}[time_range])"
    ]
  },
  {
    id: 7,
    level: 2,
    title: "Sum by Label",
    description: "Get total HTTP requests grouped by status code",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Aggregation with grouping - sum values but keep them grouped by a specific label",
    correctQuery: "sum by (code) (prometheus_http_requests_total)",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "sum by ()",
        description: "Sum values while preserving specified labels",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators"
      }
    ],
    hints: [
      "Use 'sum by (label_name)' to group by a specific label",
      "Put the label name you want to group by in parentheses",
      "Format: sum by (label_name) (metric_name)"
    ]
  },
  {
    id: 8,
    level: 2,
    title: "Increase Function",
    description: "Calculate the total increase in HTTP requests over the last 10 minutes",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Increase calculation - get the total increase in a counter over a time period",
    correctQuery: "increase(prometheus_http_requests_total[10m])",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "increase()",
        description: "Calculate total increase over time range",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/functions/#increase"
      }
    ],
    hints: [
      "Use the increase() function to get total increase",
      "Specify a time range in square brackets [10m]",
      "Format: increase(metric_name[time_range])"
    ]
  },
  {
    id: 9,
    level: 2,
    title: "Average Function",
    description: "Calculate the average HTTP request duration across all instances",
    metricName: "prometheus_http_request_duration_seconds",
    labelFilters: {},
    semanticDescription: "Average aggregation - calculate the mean value across all label dimensions",
    correctQuery: "avg(prometheus_http_request_duration_seconds)",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "avg()",
        description: "Calculate average values across dimensions",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators"
      }
    ],
    hints: [
      "Use the avg() aggregation function",
      "Wrap the metric name inside avg()",
      "Format: avg(metric_name)"
    ]
  },
  {
    id: 10,
    level: 2,
    title: "Range Vector with Sum",
    description: "Get the sum of HTTP request rates per second over 5 minutes, grouped by handler",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Complex aggregation - calculate rate and then sum by a specific label",
    correctQuery: "sum by (handler) (rate(prometheus_http_requests_total[5m]))",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "rate() + sum by ()",
        description: "Combine rate calculation with grouped aggregation",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/functions/#rate"
      }
    ],
    hints: [
      "First calculate the rate, then sum by handler",
      "Nest the rate() function inside the sum by ()",
      "Format: sum by (label) (rate(metric[time_range]))"
    ]
  },

  // Level 3: Advanced queries (Hard)
  {
    id: 11,
    level: 3,
    title: "Percentage Calculation",
    description: "Calculate the percentage of HTTP 200 responses out of all HTTP responses",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Percentage calculation - divide successful requests by total requests and multiply by 100",
    correctQuery: 'sum(rate(prometheus_http_requests_total{code="200"}[5m])) / sum(rate(prometheus_http_requests_total[5m])) * 100',
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Arithmetic operators",
        description: "Use / for division and * for multiplication",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/operators/#arithmetic-binary-operators"
      }
    ],
    hints: [
      "Calculate two separate sums: one for 200 responses, one for all responses",
      "Divide the first by the second and multiply by 100",
      "Use rate() with both sums for per-second rates"
    ]
  },
  {
    id: 12,
    level: 3,
    title: "Histogram Quantile",
    description: "Calculate the 95th percentile of HTTP request duration",
    metricName: "prometheus_http_request_duration_seconds",
    labelFilters: {},
    semanticDescription: "Quantile calculation - find the 95th percentile from histogram data",
    correctQuery: "histogram_quantile(0.95, prometheus_http_request_duration_seconds_bucket)",
    queryParams: {
      start: "now-1h", 
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "histogram_quantile()",
        description: "Calculate quantiles from histogram buckets",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile"
      }
    ],
    hints: [
      "Use histogram_quantile() function with 0.95 for 95th percentile",
      "The metric name should end with '_bucket' for histogram data",
      "Format: histogram_quantile(0.95, metric_name_bucket)"
    ]
  },
  {
    id: 13,
    level: 3,
    title: "Rate of Rate",
    description: "Calculate the rate of change of HTTP request rates (acceleration)",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Second derivative calculation - rate of change of the rate of change",
    correctQuery: "rate(rate(prometheus_http_requests_total[5m])[5m:])",
    queryParams: {
      start: "now-1h",
      end: "now", 
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Nested rate()",
        description: "Apply rate function to the result of another rate function",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/functions/#rate"
      }
    ],
    hints: [
      "Apply rate() function twice",
      "First rate() calculates the request rate, second rate() calculates how that rate is changing",
      "Use [5m:] syntax for subquery time range"
    ]
  },
  {
    id: 14,
    level: 3,
    title: "Conditional Aggregation",
    description: "Get the maximum HTTP request rate, but only for handlers that have more than 10 requests",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Conditional aggregation - apply aggregation only to metrics that meet a condition",
    correctQuery: "max(rate(prometheus_http_requests_total[5m]) > 10)",
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Comparison operators",
        description: "Use > < >= <= == != for filtering",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/operators/#comparison-binary-operators"
      }
    ],
    hints: [
      "First calculate the rate, then use comparison operator",
      "Use > 10 to filter for rates greater than 10",
      "Apply max() to get the maximum of the filtered results"
    ]
  },
  {
    id: 15,
    level: 3,
    title: "Complex Multi-step Query",
    description: "Calculate the percentage of HTTP errors (4xx and 5xx) out of total requests, grouped by handler",
    metricName: "prometheus_http_requests_total",
    labelFilters: {},
    semanticDescription: "Complex calculation - filter for error codes, sum them, divide by total, group by handler",
    correctQuery: 'sum by (handler) (rate(prometheus_http_requests_total{code=~"4..|5.."}[5m])) / sum by (handler) (rate(prometheus_http_requests_total[5m])) * 100',
    queryParams: {
      start: "now-1h",
      end: "now",
      step: "60s"
    },
    relevantFunctions: [
      {
        name: "Regex matching",
        description: "Use =~ for regex pattern matching",
        documentation: "https://prometheus.io/docs/prometheus/latest/querying/basics/#instant-vector-selectors"
      }
    ],
    hints: [
      "Use regex pattern '4..|5..' to match 4xx and 5xx status codes",
      "Calculate two separate sums: one for errors, one for all requests",
      "Group both sums by handler, then divide and multiply by 100"
    ]
  }
]; 