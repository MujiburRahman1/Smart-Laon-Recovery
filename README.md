# 🏦 Smart Loan Recovery System (React + Flask)

ML-powered system to analyze borrower risk and assign recovery strategies. Frontend in React (TailwindCSS + Plotly.js), backend in Flask (Pandas + scikit-learn + Plotly).

## ✨ Features

- **📤 CSV Upload**: Upload borrower dataset
- **📊 Risk Segmentation**: K-Means clustering → Low/Medium/High Risk
- **🎯 Default Prediction**: Random Forest → default probability
- **📋 Results Table**: Name, probability, assigned strategy
- **📈 Insights Dashboard**: Interactive Plotly charts

## 🧱 Tech Stack

- **Frontend**: React, TailwindCSS, Plotly.js
- **Backend**: Flask, Pandas, scikit-learn, Plotly

## 🧪 Sample Data

Use `sample_data.csv` to test quickly. Required columns:

| Column | Description |
| --- | --- |
| borrower_name | Name of the borrower |
| credit_score | Credit score (300–850) |
| loan_amount | Original loan amount |
| days_past_due | Days past due |
| total_paid | Total paid so far |
| age | Borrower age |
| income | Annual income |
| employment_length | Years of employment |

## ▶️ Run Locally (Windows)

1) Backend (Flask)
```powershell
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
# Health check: http://127.0.0.1:5000/api/health
```

2) Frontend (React)
```powershell
cd client
# Create .env with the backend URL
echo REACT_APP_API_URL=http://127.0.0.1:5000 > .env
npm install
npm start
# App: http://localhost:3000
```

If PowerShell blocks activation, run as Admin once:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🌐 Deploy (free)

- **Backend (Render)**
  - Root directory: `server/`
  - Build: `pip install -r requirements.txt`
  - Start: `gunicorn app:app`

- **Frontend (Vercel / Netlify)**
  - Project root: `client/`
  - Env var: `REACT_APP_API_URL=https://your-backend.onrender.com`

## 🔌 API

- **GET `/api/health`** → `{"status":"ok"}`
- **POST `/api/upload`**
  - Form-data: `file` (CSV)
  - Response: borrowers with `default_probability`, `risk_level`, `recovery_strategy`
- **GET `/api/summary`** → summary stats for charts

## 🗂️ Project Structure

```
.
├── client/                 # React app (Tailwind, Plotly.js)
│   ├── src/
│   └── package.json
├── server/                 # Flask API (Pandas, scikit-learn)
│   ├── app.py
│   └── requirements.txt
├── sample_data.csv         # Demo dataset
└── README.md
```

## 🧰 Troubleshooting

- Frontend cannot connect → check `REACT_APP_API_URL`
- Port in use → change React port: `set PORT=3001 && npm start`
- Windows build tools error (scikit-learn) → install VS Build Tools (C++), or use provided `server/requirements.txt` versions

## 📝 License

MIT — free for commercial and personal use.

---


