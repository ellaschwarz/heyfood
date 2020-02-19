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

// /* GET reviews page. */
// router.get('/', checkAuthenticated, function(req, res, next) {
//     //Get all reviews from database
//   connection.query('SELECT * FROM Reviews', (err, reviews, fields) => {
//     if (!err) {
//       console.log(reviews)
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