from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from werkzeug.utils import secure_filename
from ml_models import LoanRecoveryML
import json

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global variable to store the ML model and results
ml_model = None
current_results = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global ml_model, current_results
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Read CSV file
            df = pd.read_csv(file)
            
            # Validate required columns
            required_columns = [
                'borrower_name', 'credit_score', 'loan_amount', 
                'days_past_due', 'total_paid', 'age', 'income', 'employment_length'
            ]
            
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return jsonify({
                    'error': f'Missing required columns: {missing_columns}',
                    'required_columns': required_columns
                }), 400
            
            # Initialize and train ML model
            ml_model = LoanRecoveryML()
            cluster_labels, risk_mapping = ml_model.train_models(df)
            
            # Generate predictions and analysis
            current_results = ml_model.predict_and_analyze(df)
            
            # Convert results to DataFrame for summary stats
            results_df = pd.DataFrame(current_results)
            summary_stats = ml_model.generate_summary_stats(results_df)
            
            return jsonify({
                'message': 'File processed successfully',
                'results': current_results,
                'summary': summary_stats,
                'total_borrowers': len(current_results)
            })
        
        else:
            return jsonify({'error': 'Invalid file type. Please upload a CSV file.'}), 400
    
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    global current_results
    
    if current_results is None:
        return jsonify({'error': 'No data available. Please upload a file first.'}), 400
    
    try:
        results_df = pd.DataFrame(current_results)
        summary_stats = ml_model.generate_summary_stats(results_df)
        
        return jsonify({
            'summary': summary_stats,
            'results': current_results
        })
    
    except Exception as e:
        return jsonify({'error': f'Error generating summary: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Smart Loan Recovery System API is running'})

if __name__ == '__main__':
    print("Starting Smart Loan Recovery System API...")
    print("API will be available at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
