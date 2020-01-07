var express = require('express');
var router = express.Router();
const mysql = require('mysql');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


//Connection to restaurant database
var connection = mysql.createConnection({
  socketPath: '/Users/ellaschwarz/Library/Application Support/Local/run/VwNdX9N8O/mysqld.sock',
  user: 'root',
  password: 'root',
  database: 'Restaurants',
  debug: false,
  multipleStatements: true
});
connection.connect(function(err){
  if(!err) {
      console.log("Database is connected");
  } else {
      console.log("Error connecting to database");
  }
  });

/* GET user page. */
router.get('/register', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    //Get all restaurants from database
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (!err) {
      //console.log(rows)
      // res.render('index', {rows: rows}).send(rows);
      //res.send(rows)
      return res.render('login', {
        rows: rows, 
        name: req.user.name
      });
    } else {
      console.log(err)
      return;
    }
  });
});

module.exports = router;