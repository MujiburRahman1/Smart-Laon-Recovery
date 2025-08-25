import React from 'react';
import Plot from 'react-plotly.js';
import { useData } from '../context/DataContext';

const InsightsDashboardPage = () => {
  const { state } = useData();

  if (!state.results || !state.summary) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
        <p className="text-gray-600">Please upload a CSV file first to view insights dashboard.</p>
      </div>
    );
  }

  // Prepare data for charts
  const riskDistribution = state.summary.risk_distribution;
  const strategyDistribution = state.summary.strategy_distribution;
  const avgDefaultByRisk = state.summary.avg_default_by_risk;

  // Risk Distribution Pie Chart
  const riskPieData = [{
    type: 'pie',
    labels: Object.keys(riskDistribution),
    values: Object.values(riskDistribution),
    marker: {
      colors: ['#22c55e', '#f59e0b', '#ef4444']
    },
    textinfo: 'label+percent',
    textposition: 'outside',
    hole: 0.4
  }];

  const riskPieLayout = {
    title: {
      text: 'Risk Level Distribution',
      font: { size: 18, color: '#1f2937' }
    },
    showlegend: true,
    height: 400
  };

  // Strategy Distribution Bar Chart
  const strategyBarData = [{
    type: 'bar',
    x: Object.keys(strategyDistribution),
    y: Object.values(strategyDistribution),
    marker: {
      color: ['#3b82f6', '#8b5cf6', '#ef4444']
    }
  }];

  const strategyBarLayout = {
    title: {
      text: 'Recovery Strategy Distribution',
      font: { size: 18, color: '#1f2937' }
    },
    xaxis: {
      title: 'Strategy'
    },
    yaxis: {
      title: 'Number of Borrowers'
    },
    height: 400
  };

  // Average Default Probability by Risk Level
  const defaultBarData = [{
    type: 'bar',
    x: Object.keys(avgDefaultByRisk),
    y: Object.values(avgDefaultByRisk),
    marker: {
      color: ['#22c55e', '#f59e0b', '#ef4444']
    }
  }];

  const defaultBarLayout = {
    title: {
      text: 'Average Default Probability by Risk Level',
      font: { size: 18, color: '#1f2937' }
    },
    xaxis: {
      title: 'Risk Level'
    },
    yaxis: {
      title: 'Default Probability (%)'
    },
    height: 400
  };

  // Credit Score vs Default Probability Scatter
  const scatterData = [{
    type: 'scatter',
    mode: 'markers',
    x: state.results.map(r => r.credit_score),
    y: state.results.map(r => r.default_probability),
    marker: {
      color: state.results.map(r => {
        switch (r.risk_level) {
          case 'Low Risk': return '#22c55e';
          case 'Medium Risk': return '#f59e0b';
          case 'High Risk': return '#ef4444';
          default: return '#6b7280';
        }
      }),
      size: 8,
      opacity: 0.7
    },
    text: state.results.map(r => r.borrower_name),
    hovertemplate: 
      '<b>%{text}</b><br>' +
      'Credit Score: %{x}<br>' +
      'Default Probability: %{y:.1f}%<extra></extra>'
  }];

  const scatterLayout = {
    title: {
      text: 'Credit Score vs Default Probability',
      font: { size: 18, color: '#1f2937' }
    },
    xaxis: {
      title: 'Credit Score'
    },
    yaxis: {
      title: 'Default Probability (%)'
    },
    height: 400
  };

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Insights Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive analytics and visualizations for loan recovery insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Borrowers</p>
              <p className="text-2xl font-bold text-gray-900">{state.summary.total_borrowers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Default Probability</p>
              <p className="text-2xl font-bold text-red-600">{state.summary.avg_default_probability}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Credit Score</p>
              <p className="text-2xl font-bold text-green-600">{state.summary.avg_credit_score}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
              <p className="text-2xl font-bold text-purple-600">${(state.summary.total_loan_amount / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Plot
            data={riskPieData}
            layout={riskPieLayout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>

        {/* Strategy Distribution Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Plot
            data={strategyBarData}
            layout={strategyBarLayout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>

        {/* Average Default Probability Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Plot
            data={defaultBarData}
            layout={defaultBarLayout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>

        {/* Credit Score vs Default Probability Scatter */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Plot
            data={scatterData}
            layout={scatterLayout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>

      {/* Insights Summary */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Risk Analysis</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {riskDistribution['Low Risk'] || 0} borrowers are classified as low risk</li>
              <li>• {riskDistribution['Medium Risk'] || 0} borrowers require moderate attention</li>
              <li>• {riskDistribution['High Risk'] || 0} borrowers need immediate intervention</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Strategy Recommendations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {strategyDistribution['Automated reminders'] || 0} borrowers will receive automated reminders</li>
              <li>• {strategyDistribution['Settlement offers'] || 0} borrowers are eligible for settlement offers</li>
              <li>• {strategyDistribution['Legal actions'] || 0} borrowers may require legal intervention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboardPage;
