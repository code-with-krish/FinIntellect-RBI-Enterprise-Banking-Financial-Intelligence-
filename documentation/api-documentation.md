# API Architecture & Endpoint Reference

All analytical endpoints execute on the Next.js server runtime, safeguarding database credentials and proprietary data transformation logic.

---

### 1. `GET /api/kpis`
- **Description**: Retrieves aggregate Scheduled Commercial Bank macro KPIs for the latest reporting cycle.
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalDeposits": 20438000.0,
      "totalAdvances": 16420000.0,
      "cdRatio": 80.34,
      "grossNpa": 460000.0,
      "netNpa": 124000.0,
      "gnpaRatio": 2.80,
      "avgRoa": 1.15,
      "totalBranches": 158400,
      "source": "Reserve Bank of India (RBI) DBIE & BSR Releases"
    }
  }
  ```

---

### 2. `GET /api/financial-performance`
- **Description**: Returns multi-year deposit vs credit trends and bank-group breakdowns (PSBs, Private, Foreign, RRBs).
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "trends": [...],
      "bankGroups": [...]
    }
  }
  ```

---

### 3. `GET /api/branch-analysis`
- **Description**: Returns state-wise credit deployment, deposits mobilized, active branch counts, and CD ratios across all 36 Indian States and UTs.

---

### 4. `GET /api/sector-analysis`
- **Description**: Returns sectoral gross credit deployment across Agriculture, Micro/Small/Medium/Large Industry, Services, and Personal Loans.

---

### 5. `GET /api/anomalies`
- **Description**: Returns audit log of detected statistical anomalies ($|Z| > 2.5$, metric spikes) tagged with severity, observed values, and baseline deviations.

---

### 6. `GET /api/data-quality`
- **Description**: Returns data completeness scores, consistency scores, and the cleaning audit log (whitespace trimmed, duplicates removed, negative anomalies rectified).

---

### 7. `POST /api/ai/chat`
- **Description**: Primary AI Decision Intelligence endpoint. Receives a user question, detects analytical intent, constructs the audited Evidence Bundle, and calls Google Gemini server-side.
- **Request Body**:
  ```json
  {
    "query": "Explain the NPA trend and asset quality.",
    "intent": "asset_quality"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "query": "...",
      "response": "### Executive Summary...",
      "evidence": [...],
      "sourceOfTruth": "PostgreSQL Database & Python Validated Returns",
      "model": "gemini-2.5-flash"
    }
  }
  ```

---

### 8. `POST /api/report/upload`
- **Description**: Accepts `multipart/form-data` with a file (PDF, CSV, XLSX, XLS, TXT). Extracts document structure, returns parsed metadata, and enables document-grounded chatbot Q&A.

---

### 9. `GET /api/report/generate`
- **Description**: Streams the server-generated executive PDF report (`application/pdf`) built by Python's ReportLab engine.
