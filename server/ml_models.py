import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import plotly.graph_objects as go
import plotly.express as px
import json

class LoanRecoveryML:
    def __init__(self):
        self.kmeans = None
        self.rf_classifier = None
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def preprocess_data(self, df):
        """Preprocess the loan data for ML models"""
        # Create features for ML
        df['credit_score_normalized'] = (df['credit_score'] - 300) / (850 - 300)
        df['loan_amount_normalized'] = (df['loan_amount'] - df['loan_amount'].min()) / (df['loan_amount'].max() - df['loan_amount'].min())
        df['days_past_due_normalized'] = df['days_past_due'] / df['days_past_due'].max()
        df['payment_ratio'] = df['total_paid'] / df['loan_amount']
        
        # Select features for clustering
        clustering_features = [
            'credit_score_normalized',
            'loan_amount_normalized', 
            'days_past_due_normalized',
            'payment_ratio',
            'age',
            'income'
        ]
        
        # Select features for default prediction
        prediction_features = [
            'credit_score',
            'loan_amount',
            'days_past_due',
            'total_paid',
            'age',
            'income',
            'employment_length'
        ]
        
        return df, clustering_features, prediction_features
    
    def train_models(self, df):
        """Train K-Means and Random Forest models"""
        df, clustering_features, prediction_features = self.preprocess_data(df)
        
        # Prepare data for clustering
        X_cluster = df[clustering_features].fillna(0)
        X_cluster_scaled = self.scaler.fit_transform(X_cluster)
        
        # Train K-Means clustering
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        cluster_labels = self.kmeans.fit_predict(X_cluster_scaled)
        
        # Map clusters to risk levels (0=low, 1=medium, 2=high)
        # Based on average credit score and payment ratio
        cluster_stats = df.groupby(cluster_labels).agg({
            'credit_score': 'mean',
            'payment_ratio': 'mean'
        }).reset_index()
        
        # Sort by credit score (higher = lower risk) and payment ratio
        cluster_stats['risk_score'] = cluster_stats['credit_score'] * cluster_stats['payment_ratio']
        cluster_stats = cluster_stats.sort_values('risk_score', ascending=False)
        
        # Create mapping: cluster_id -> risk_level
        risk_mapping = {}
        for i, cluster_id in enumerate(cluster_stats['index']):
            risk_mapping[cluster_id] = ['Low Risk', 'Medium Risk', 'High Risk'][i]
        
        # Prepare data for default prediction
        X_pred = df[prediction_features].fillna(0)
        
        # Create target variable (simplified default prediction)
        # Assume default if days_past_due > 90 or payment_ratio < 0.3
        y = ((df['days_past_due'] > 90) | (df['payment_ratio'] < 0.3)).astype(int)
        
        # Train Random Forest
        X_train, X_test, y_train, y_test = train_test_split(X_pred, y, test_size=0.2, random_state=42)
        self.rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.rf_classifier.fit(X_train, y_train)
        
        self.is_trained = True
        return cluster_labels, risk_mapping
    
    def predict_and_analyze(self, df):
        """Generate predictions and analysis for the dataset"""
        if not self.is_trained:
            raise ValueError("Models must be trained first")
        
        df, clustering_features, prediction_features = self.preprocess_data(df)
        
        # Get cluster predictions
        X_cluster = df[clustering_features].fillna(0)
        X_cluster_scaled = self.scaler.transform(X_cluster)
        cluster_labels = self.kmeans.predict(X_cluster_scaled)
        
        # Get default probability predictions
        X_pred = df[prediction_features].fillna(0)
        default_probs = self.rf_classifier.predict_proba(X_pred)[:, 1]
        
        # Assign risk levels and strategies
        results = []
        for i, (_, row) in enumerate(df.iterrows()):
            cluster_id = cluster_labels[i]
            risk_level = self._get_risk_level(cluster_id, default_probs[i])
            strategy = self._assign_strategy(risk_level, default_probs[i])
            
            results.append({
                'borrower_name': row['borrower_name'],
                'risk_level': risk_level,
                'default_probability': round(default_probs[i] * 100, 2),
                'strategy': strategy,
                'cluster_id': int(cluster_id),
                'credit_score': int(row['credit_score']),
                'loan_amount': float(row['loan_amount']),
                'days_past_due': int(row['days_past_due']),
                'total_paid': float(row['total_paid']),
                'age': int(row['age']),
                'income': float(row['income'])
            })
        
        return results
    
    def _get_risk_level(self, cluster_id, default_prob):
        """Determine risk level based on cluster and default probability"""
        if default_prob < 0.3:
            return "Low Risk"
        elif default_prob < 0.7:
            return "Medium Risk"
        else:
            return "High Risk"
    
    def _assign_strategy(self, risk_level, default_prob):
        """Assign recovery strategy based on risk level"""
        if risk_level == "Low Risk":
            return "Automated reminders"
        elif risk_level == "Medium Risk":
            return "Settlement offers"
        else:
            return "Legal actions"
    
    def generate_summary_stats(self, results_df):
        """Generate summary statistics for dashboard"""
        # Risk level distribution
        risk_distribution = results_df['risk_level'].value_counts().to_dict()
        
        # Strategy distribution
        strategy_distribution = results_df['strategy'].value_counts().to_dict()
        
        # Average default probability by risk level
        avg_default_by_risk = results_df.groupby('risk_level')['default_probability'].mean().to_dict()
        
        # Cluster distribution
        cluster_distribution = results_df['cluster_id'].value_counts().to_dict()
        
        # Overall statistics
        total_borrowers = len(results_df)
        avg_default_prob = results_df['default_probability'].mean()
        avg_credit_score = results_df['credit_score'].mean()
        total_loan_amount = results_df['loan_amount'].sum()
        
        return {
            'total_borrowers': total_borrowers,
            'avg_default_probability': round(avg_default_prob, 2),
            'avg_credit_score': round(avg_credit_score, 0),
            'total_loan_amount': round(total_loan_amount, 2),
            'risk_distribution': risk_distribution,
            'strategy_distribution': strategy_distribution,
            'avg_default_by_risk': {k: round(v, 2) for k, v in avg_default_by_risk.items()},
            'cluster_distribution': cluster_distribution
        }
