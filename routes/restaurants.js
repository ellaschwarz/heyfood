const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const requestPromise = require('request-promise');
const path = require('path');



// router.get('/', function(req, res, next) {
//     console.log('working')
//   res.render('index', {title: 'Express'}
//   );
// });

// router.use(bodyParser.urlencoded({
//     extended: false
// }));

// router.post('/', (req, res, err) => {
//     console.log('restaurants router is working here')
//     requestPromise('http://127.0.0.1:3000/restaurants', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(req.body),
//     }).then(() => {
//         res.redirect('index')
//     }).catch((err) => {
//         console.log('Something went wrong')
//     })
// });


// router.get('/index', (req, res) => {
//     requestPromise('http://127.0.0.1:3000/index', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(restaurants => {
//         res.render('index', { "restaurants": JSON.parse(restaurants) })
//     });
// });

module.exports = router;