import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";

dotenv.config();
const myApp = express();
const myPort = process.env.port;
const today = new Date().toISOString().split('T')[0];

const db = new pg.Client
({
    user: process.env.dbUsername,
    host: process.env.dbHost,
    database: process.env.dbDatabase,
    password: process.env.dbPassword,
    port: process.env.dbPort
});

db.connect();
myApp.use(bodyParser.urlencoded({extended:true}));
myApp.use(express.static("public"));


myApp.get("/", async (req, res) =>
{
    const spent = await totalSpent();
    res.render("index.ejs", {thisMonth: spent});
});

myApp.post("/add", async (req, res) =>
{
    var date = req.body.date;
    var amount = req.body.amount;
    var category = req.body.category;

    await db.query("INSERT INTO spent (time, money_spent, category) VALUES($1, $2, $3)",
        [date, amount, category]);

    res.redirect("/");
});

myApp.get("/report", async (req, res) =>
{
    const data = await generateReport();
    const spent = await totalSpent();
    res.render("report.ejs", {expenses: data, thisMonth: spent});
});

myApp.get("/download-report", async (req, res) =>
{
    const data = await generateReport();
    const doc = new PDFDocument();

    // Set headers
    res.setHeader("Content-Disposition", "attachment; filename=Expense_Report.pdf");
    res.setHeader("Content-Type", "application/pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text("Expense Report", { align: "center" });
    doc.moveDown();

    // Add table headers
    doc.fontSize(12).text("Date", 100, doc.y, { continued: true });
    doc.text("Amount (Rs)", 200, doc.y, { continued: true });
    doc.text("Category", 320, doc.y);
    doc.moveDown();

    // Add each row
    data.forEach(item =>
    {
        doc.text(item.date, 100, doc.y, { continued: true });
        doc.text(item.money_spent.toString(), 200, doc.y, { continued: true });
        doc.text(item.category.replace("_", " "), 320, doc.y);
    });

  // End the PDF
  doc.end();

});

async function generateReport()
{
    const result = await db.query(
        "SELECT TO_CHAR(time, 'DD-MM-YYYY') AS date, money_spent, category FROM spent ORDER BY date ASC");
    
    return result.rows;
}

async function totalSpent()
{
    const result = await db.query("SELECT SUM(money_spent) FROM spent");
    var sum = result.rows[0].sum;
 
    return sum;
}

myApp.listen(myPort, () =>
{
    console.log(`Server is running on Port: ${myPort}`);
});
