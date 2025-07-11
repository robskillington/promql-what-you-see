import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Chart = ({ data, title, loading, error }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title || 'PromQL Query Result',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5
      }
    }
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          <h4>Error loading chart</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <h4>No data available</h4>
          <p>The query returned no results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart; 