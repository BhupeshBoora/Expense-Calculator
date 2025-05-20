# Expense Tracker

A simple web application to track daily expenses with category-wise entries, monthly total, and downloadable PDF reports.

---

## Features

- Add new expenses with date, amount, and category
- View a detailed expense report sorted by date
- Download expense report as a PDF file
- Shows total expenses so far on the homepage
- Responsive UI styled with Bootstrap

---

## Tech Stack

- Node.js with Express.js for backend
- PostgreSQL as the database
- EJS templating engine for views
- PDFKit for generating PDF reports
- Bootstrap 5 for frontend styling
- dotenv for environment variable management

---

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root folder with the following environment variables:

```ini
dbUsername=your_db_username
dbHost=your_db_host
dbDatabase=your_db_name
dbPassword=your_db_password
dbPort=your_db_port
port=3000
```

Set up the PostgreSQL table `spent` with this schema:

```sql
CREATE TABLE spent (
    id SERIAL PRIMARY KEY,
    time DATE NOT NULL,
    money_spent NUMERIC NOT NULL,
    category VARCHAR(50) NOT NULL
);
```

Run the server:

```bash
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

For questions or contributions, feel free to submit a pull request.
