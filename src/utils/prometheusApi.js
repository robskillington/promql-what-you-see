import axios from 'axios';

const PROMETHEUS_BASE_URL = 'https://prometheus.demo.prometheus.io/api/v1';

// Helper function to convert relative time to Unix timestamp
function getUnixTimestamp(timeString) {
  const now = new Date();
  
  if (timeString === 'now') {
    return Math.floor(now.getTime() / 1000);
  }
  
  // Parse relative time like "now-1h"
  const match = timeString.match(/^now-(\d+)([mhd])$/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];
    
    let milliseconds = 0;
    switch (unit) {
      case 'm':
        milliseconds = value * 60 * 1000;
        break;
      case 'h':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'd':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new Error(`Invalid time unit: ${unit}`);
    }
    
    return Math.floor((now.getTime() - milliseconds) / 1000);
  }
  
  throw new Error(`Invalid time format: ${timeString}`);
}

// Main function to query Prometheus range API
export async function queryPrometheusRange(query, queryParams) {
  try {
    const start = getUnixTimestamp(queryParams.start);
    const end = getUnixTimestamp(queryParams.end);
    
    const url = `${PROMETHEUS_BASE_URL}/query_range`;
    const params = {
      query: query,
      start: start,
      end: end,
      step: queryParams.step || '60s'
    };
    
    console.log('Making Prometheus API call:', { url, params });
    
    const response = await axios.get(url, { params });
    
    if (response.data.status !== 'success') {
      throw new Error(`Prometheus API error: ${response.data.error || 'Unknown error'}`);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error querying Prometheus:', error);
    
    if (error.response) {
      // Server responded with an error
      throw new Error(`Prometheus API error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to connect to Prometheus Demo server');
    } else {
      // Other error
      throw new Error(`Query error: ${error.message}`);
    }
  }
}

// Function to transform Prometheus data for Chart.js
export function transformPrometheusDataForChart(prometheusData) {
  if (!prometheusData || !prometheusData.result || prometheusData.result.length === 0) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  const datasets = [];
  
  prometheusData.result.forEach((result, index) => {
    const metricName = result.metric.__name__ || 'Unknown Metric';
    
    // Create label for this series
    const labels = Object.keys(result.metric)
      .filter(key => key !== '__name__')
      .map(key => `${key}="${result.metric[key]}"`)
      .join(', ');
    
    const seriesLabel = labels ? `${metricName}{${labels}}` : metricName;
    
    // Transform data points
    const data = result.values.map(([timestamp, value]) => ({
      x: new Date(timestamp * 1000),
      y: parseFloat(value)
    }));
    
    datasets.push({
      label: seriesLabel,
      data: data,
      borderColor: getColorForIndex(index),
      backgroundColor: getColorForIndex(index, 0.1),
      fill: false,
      tension: 0.1
    });
  });
  
  return {
    datasets: datasets
  };
}

// Function to parse/validate a PromQL query
export async function parsePrometheusQuery(query) {
  try {
    if (!query || query.trim() === '') {
      return { valid: false, status: 'empty' };
    }

    const url = `${PROMETHEUS_BASE_URL}/parse_query`;
    const params = { query: query.trim() };
    
    const response = await axios.get(url, { params });
    
    if (response.status === 200) {
      return { valid: true, status: 'valid', data: response.data };
    } else {
      return { valid: false, status: 'unknown', error: 'Unexpected response' };
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Invalid query
      return { 
        valid: false, 
        status: 'invalid', 
        error: error.response.data.error || 'Invalid PromQL query syntax'
      };
    } else if (error.response) {
      // Other HTTP error
      return { 
        valid: false, 
        status: 'unknown', 
        error: `HTTP ${error.response.status}: ${error.response.statusText}`
      };
    } else {
      // Network or other error
      return { 
        valid: false, 
        status: 'unknown', 
        error: 'Network error or server unavailable'
      };
    }
  }
}

// Generate colors for chart lines
function getColorForIndex(index, alpha = 1) {
  const colors = [
    `rgba(54, 162, 235, ${alpha})`,   // Blue
    `rgba(255, 99, 132, ${alpha})`,   // Red
    `rgba(255, 206, 86, ${alpha})`,   // Yellow
    `rgba(75, 192, 192, ${alpha})`,   // Green
    `rgba(153, 102, 255, ${alpha})`,  // Purple
    `rgba(255, 159, 64, ${alpha})`,   // Orange
    `rgba(199, 199, 199, ${alpha})`,  // Grey
    `rgba(83, 102, 255, ${alpha})`,   // Indigo
    `rgba(255, 99, 255, ${alpha})`,   // Pink
    `rgba(99, 255, 132, ${alpha})`    // Light Green
  ];
  
  return colors[index % colors.length];
} 