import express from "express";
import bodyParser from "body-parser";
import pg, { Client } from "pg";

const myApp = express();
const myPort = 3000;
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


myApp.listen(myPort, () =>
{
    console.log(`Server is running on Port: ${myPort}`);
});

myApp.get("/", (req, res) =>
{
    res.render("index.ejs");
});

myApp.post("/add", async (req, res) =>
{
    var amount = req.body.amount;
    var category = req.body.category;
    var date = req.body.date;

    var result = await db.query("INSERT INTO spent (time, money_spent, category) VALUES($1, $2, $3)",
        [date, amount, category]);
});
