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