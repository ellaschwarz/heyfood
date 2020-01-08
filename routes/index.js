const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const {checkAuthenticated} = require('../passport/authenticate');

//Connection to restaurant database
var connection = mysql.createConnection({
  socketPath: '/Users/ellaschwarz/Library/Application Support/Local/run/VwNdX9N8O/mysqld.sock',
  user: 'root',
  password: 'root',
  database: 'Restaurants',
  debug: false,
  multipleStatements: true
});

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  // res.render('index', { title: 'Express' });
    //Get all restaurants from database
  connection.query('SELECT * FROM Restauranttable', (err, rows, fields) => {
    if (!err) {
      //console.log(rows)
      //console.log(reviews)
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

  //Get comments from database
  // connection.query('SELECT * FROM Reviews', (err, reviews, fields) => {
  //   if (!err) {
  //     //console.log(rows)
  //     //console.log(reviews)
  //     // res.render('index', {rows: rows}).send(rows);
  //     //res.send(rows)
  //     return res.render('index', {
  //       reviews: reviews
  //     });
  //   } else {
  //     console.log(err)
  //     return;
  //   }
  // });

/* GET home page. */
// router.get('/', checkAuthenticated, function(req, res, next) {
//   // res.render('index', { title: 'Express' });
//     //Get all restaurants from database
//   connection.query('SELECT * FROM Reviews', (err, reviews, fields) => {
//     if (!err) {
//       console.log(reviews)
//       // res.render('index', {rows: rows}).send(rows);
//       //res.send(rows)
//       return res.render('index', {
//         reviews: reviews, 
  
//       });
//     } else {
//       console.log(err)
//       return;
//     }
//   });
// });

module.exports = router;
