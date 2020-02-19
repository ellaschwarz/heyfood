const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const {checkAuthenticated} = require('../passport/authenticate');

//Connection to restaurant database
var connection = mysql.createConnection({
  host: "xav-p-mariadb01.xavizus.com",
  user: "ella",
  password: "xdWThTEK9bMxqLXk",
  database: "ella",
  port: 16200,
  debug: false,
  multipleStatements: true
});

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  
    //Get all restaurants from database
  connection.query('SELECT * FROM Restauranttable', (err, rows, fields) => {
    if (!err) {
      // res.render('index', {rows: rows}).send(rows);
      //res.send(rows)
      return res.render('index', {
        rows: rows, 
        name: req.user.name,
        
      });
    } else {
      console.log(err)
      return;
    }
  });
});


module.exports = router;
