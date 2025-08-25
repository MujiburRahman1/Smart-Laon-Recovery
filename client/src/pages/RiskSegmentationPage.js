import React from 'react';
import Plot from 'react-plotly.js';
import { useData } from '../context/DataContext';

const RiskSegmentationPage = () => {
  const { state } = useData();

  if (!state.results) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
        <p className="text-gray-600">Please upload a CSV file first to view risk segmentation.</p>
      </div>
    );
  }

  // Prepare data for scatter plot
  const lowRisk = state.results.filter(r => r.risk_level === 'Low Risk');
  const mediumRisk = state.results.filter(r => r.risk_level === 'Medium Risk');
  const highRisk = state.results.filter(r => r.risk_level === 'High Risk');

  const plotData = [
    {
      x: lowRisk.map(r => r.credit_score),
      y: lowRisk.map(r => r.default_probability),
      mode: 'markers',
      type: 'scatter',
      name: 'Low Risk',
      marker: {
        color: '#22c55e',
        size: 10,
        opacity: 0.7
      },
      hovertemplate: 
        '<b>%{text}</b><br>' +
        'Credit Score: %{x}<br>' +
        'Default Probability: %{y:.1f}%<br>' +
        'Risk Level: Low Risk<extra></extra>',
      text: lowRisk.map(r => r.borrower_name)
    },
    {
      x: mediumRisk.map(r => r.credit_score),
      y: mediumRisk.map(r => r.default_probability),
      mode: 'markers',
      type: 'scatter',
      name: 'Medium Risk',
      marker: {
        color: '#f59e0b',
        size: 10,
        opacity: 0.7
      },
      hovertemplate: 
        '<b>%{text}</b><br>' +
        'Credit Score: %{x}<br>' +
        'Default Probability: %{y:.1f}%<br>' +
        'Risk Level: Medium Risk<extra></extra>',
      text: mediumRisk.map(r => r.borrower_name)
    },
    {
      x: highRisk.map(r => r.credit_score),
      y: highRisk.map(r => r.default_probability),
      mode: 'markers',
      type: 'scatter',
      name: 'High Risk',
      marker: {
        color: '#ef4444',
        size: 10,
        opacity: 0.7
      },
      hovertemplate: 
        '<b>%{text}</b><br>' +
        'Credit Score: %{x}<br>' +
        'Default Probability: %{y:.1f}%<br>' +
        'Risk Level: High Risk<extra></extra>',
      text: highRisk.map(r => r.borrower_name)
    }
  ];

  const layout = {
    title: {
      text: 'Borrower Risk Segmentation',
      font: { size: 24, color: '#1f2937' }
    },
    xaxis: {
      title: 'Credit Score',
      gridcolor: '#e5e7eb',
      zeroline: false
    },
    yaxis: {
      title: 'Default Probability (%)',
      gridcolor: '#e5e7eb',
      zeroline: false
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: { color: '#374151' },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#d1d5db',
      borderwidth: 1
    },
    margin: { l: 60, r: 30, t: 60, b: 60 }
  };

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
  };

  // Calculate statistics
  const totalBorrowers = state.results.length;
  const riskDistribution = {
    'Low Risk': lowRisk.length,
    'Medium Risk': mediumRisk.length,
    'High Risk': highRisk.length
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Risk Segmentation Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Visual representation of borrower risk levels based on credit scores and default probabilities.
        </p>
      </div>

      {/* Statistics Cards */}
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
              <p className="text-2xl font-bold text-gray-900">{totalBorrowers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Risk</p>
              <p className="text-2xl font-bold text-green-600">{riskDistribution['Low Risk']}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{riskDistribution['Medium Risk']}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">{riskDistribution['High Risk']}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="h-96">
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>

      {/* Risk Level Explanation */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Low Risk</h3>
          <p className="text-green-700 text-sm">
            Borrowers with high credit scores and low default probabilities. 
            Recommended strategy: Automated reminders and gentle follow-ups.
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Medium Risk</h3>
          <p className="text-yellow-700 text-sm">
            Borrowers with moderate credit scores and default probabilities. 
            Recommended strategy: Settlement offers and payment plans.
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">High Risk</h3>
          <p className="text-red-700 text-sm">
            Borrowers with low credit scores and high default probabilities. 
            Recommended strategy: Legal actions and aggressive collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskSegmentationPage;
