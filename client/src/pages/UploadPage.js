import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { uploadFile } from '../utils/api';

const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { dispatch } = useData();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please select a valid CSV file');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await uploadFile(selectedFile);
      
      dispatch({
        type: 'SET_RESULTS',
        payload: {
          results: response.results,
          summary: response.summary
        }
      });

      // Navigate to risk segmentation page
      navigate('/risk-segmentation');
    } catch (error) {
      console.error('Upload error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to upload file'
      });
    } finally {
      setUploading(false);
    }
  };

  const requiredColumns = [
    'borrower_name',
    'credit_score', 
    'loan_amount',
    'days_past_due',
    'total_paid',
    'age',
    'income',
    'employment_length'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Borrower Data
        </h1>
        <p className="text-lg text-gray-600">
          Upload a CSV file containing borrower information to analyze risk and generate recovery strategies.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {selectedFile ? selectedFile.name : 'Drop your CSV file here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Choose File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <div className="mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {uploading ? 'Processing...' : 'Upload and Analyze'}
            </button>
          </div>
        )}

        {/* Required Columns Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Required CSV Columns
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {requiredColumns.map((column) => (
              <div key={column} className="text-sm bg-white px-3 py-2 rounded border">
                {column}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Make sure your CSV file contains all the required columns above. The system will automatically process the data and generate risk assessments and recovery strategies.
          </p>
        </div>

        {/* Sample Data Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Need Sample Data?
          </h3>
          <p className="text-blue-700">
            Use the provided <code className="bg-blue-100 px-1 rounded">sample_data.csv</code> file to test the system. 
            This file contains example borrower data that demonstrates all the required features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
