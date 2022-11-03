const express = require('express');
const app = express();
const mysql = require('mysql');
require('dotenv').config();
const env = process.env;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index',(req,res) => {
  connection.query('SELECT * FROM items',(error,results) => {
    res.render('index.ejs',{items: results});
  })
});

app.get('/new',(req,res) => {
  res.render('new.ejs');
});

app.post('/create',(req,res) => {
  connection.query(
    'INSERT INTO items (name) VALUES(?)',
    [req.body.itemName],
    (error,results) => {
      res.redirect('/index');
    });
});

app.post('/delete/:id',(req,res) => {
  connection.query(
    "DELETE FROM items WHERE id = ?",
    [req.params.id],
    (error,results)=>{
      res.redirect('/index');
    });
});

app.get('/edit/:id',(req,res) => {
  connection.query(
    "SELECT * FROM items WHERE id = ?",
    [req.params.id],
    (error,results) => {
      res.render('edit.ejs',{item: results[0]});
    });
});

app.post('/update/:id',(req,res) => {
  connection.query(
    "UPDATE items SET name = ? WHERE id = ?",
    [req.body.itemName,req.params.id],
    (error,results) => {
      res.redirect('/index');
    });
});

app.listen(process.env.PORT || 3000);
