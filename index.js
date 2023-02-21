const express = require('express')
const path = require('path')
const pug = require('pug')
var bodyParser = require('body-parser');
const app = express()

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))

//sqlite package
const sqlite3 = require('sqlite3').verbose();

// declare the globle variable for categories
global.categories = [];

// Connect to database file
let db = new sqlite3.Database('teambits.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the mydb database.');
 });

 // Perform SELECT operation
db.all('SELECT * FROM category', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.id + ': ' + row.name);
    global.categories.push(row.name);
  });
});

// For todays date;
Date.prototype.today = function () { 
  return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
   return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

// get current date&time
currentDateTime = new Date().today() + " " + new Date().timeNow();

// Contact Us Form
app.post('/add', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO contact(name, email, message, created_on, updated_on) VALUES(?, ?, ?, ?, ?)', [req.body.name, req.body.email, req.body.message, currentDateTime, currentDateTime], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New Contact Info has been added");
      res.send("New employee has been added into the database with ID = "+req.body.name+ " and Name = "+req.body.email);
    });
});
});

// Page Routes

app.get('/', function (req, res) {
  res.render("index", { categories: global.categories});
})

app.get('/about', function (req, res) {
  res.render("about");
})

app.get('/contact', function (req, res) {
  res.render("contact");
})

// Closing the database connection.
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});


app.listen(2000)
console.log("Running on port 2000");