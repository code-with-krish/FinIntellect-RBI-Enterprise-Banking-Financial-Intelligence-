# Production Security Architecture

## 1. Secret Isolation & Credential Protection
- **No Client-Side Secret Leakage**: The Google Gemini API key (`GEMINI_API_KEY`) is strictly confined to server-side Next.js route handlers. It is **never** prefixed with `NEXT_PUBLIC_`, ensuring it is excluded from client JavaScript bundles.
- **Hosted PostgreSQL Credentials**: Database connection strings (`DATABASE_URL`) are read exclusively in Node.js server context with SSL enforcement (`ssl: { rejectUnauthorized: false }`).
- **Version Control Safety**: `.env`, `.env.local`, and uploaded documents are strictly excluded in `.gitignore`. The repository only maintains `.env.example` with non-functional placeholders.

---

## 2. Prevention of Arbitrary SQL Execution
In traditional LLM integrations, text-to-SQL systems often run unbounded queries against production databases, introducing critical injection and performance risks.
- In our platform, **arbitrary SQL generation is strictly forbidden**.
- The AI has **zero** database connection credentials.
- All database interactions pass through predefined, parameterized analytical queries and pre-indexed views (`sql/views.sql`).

---

## 3. Uploaded Document Session Security
- **In-Memory / Session Processing**: Uploaded PDF, CSV, and XLSX documents are processed in-memory within temporary session streams and are **never** persisted to public buckets or long-term databases.
- **File Validation**: File uploads are restricted to supported extensions (`.pdf`, `.csv`, `.xlsx`, `.xls`, `.txt`) with a strict 10MB payload size ceiling.
