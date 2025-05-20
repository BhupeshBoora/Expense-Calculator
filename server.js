import express from "express";
import bodyParser from "body-parser";
import pg, { Client } from "pg";

const myApp = express();
const myPort = 3000;
const today = new Date().toISOString().split('T')[0];
const db = new pg.Client
({
    user: "postgres",
    host: "localhost",
    database: "Expenses",
    password: "Prototype@2nd",
    port: 5433
});

myApp.use(bodyParser.urlencoded({extended:true}));
myApp.use(express.static("public"));
db.connect();

myApp.get("/", (req, res) =>
{
    res.render("index.ejs",
        {
            today: 200,
            thisWeek: 500,
            thisMonth: 1000
        }
    );
});

myApp.post("/add", async (req, res) =>
{
    var amount = req.body.amount;
    var category = req.body.category;
    var date = req.body.date;

    await db.query("INSERT INTO spent (time, money_spent, category) VALUES($1, $2, $3)",
        [date, amount, category]);

    res.redirect("/");
});

myApp.get("/report", async (req, res) =>
{
    const data = await generateReport();
    res.send(data);
});

async function generateReport()
{
    const result = await db.query(
        "SELECT TO_CHAR(time, 'DD-MM-YYYY') AS date, money_spent, category FROM spent ORDER BY date ASC");
    
    return result.rows;
}

myApp.listen(myPort, () =>
{
    console.log(`Server is running on Port: ${myPort}`);
});
