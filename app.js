const createError = require("http-errors");
const express = require("express");
const http = require("http");
// const ejs = require('ejs');
const requestPromise = require("request-promise");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3000;

allRestaurants = [];

//Connection to restaurant database
var connection = mysql.createConnection({
  socketPath:
    "/Users/ellaschwarz/Library/Application Support/Local/run/VwNdX9N8O/mysqld.sock",
  user: "root",
  password: "root",
  database: "Restaurants",
  debug: false,
  multipleStatements: true
});

//Error handler
connection.connect(function(err) {
  if (err) {
    console.error("Error:- " + err.stack);
    return;
  }
  console.log("Connected Id:- " + connection.threadId);
});

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const restaurantsRouter = require("./routes/restaurants");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
//For body parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Serve static files
app.use(express.static(path.join(__dirname, "public")));

//Get restaurants
app.get("/restaurants", (req, res) => {
  //Get all restaurants from database
  connection.query("SELECT * FROM Restauranttable", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
      allRestaurants.push(rows);
    } else {
      console.log(err);
      return;
    }
  });
});

// app.post('/restaurants', (req, res) => {
//   requestPromise('http://127.0.0.1:3000/restaurants', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(req.body),
//   }).then(() => {
//       res.redirect('index')
//   })

//Get one restaurant
app.get("/restaurants/:id", (req, res) => {
  connection.query(
    "SELECT * FROM Restauranttable WHERE idRestaurants = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        return res.send(rows);
        res.json(rows);
        return;
      } else {
        console.log(err);
      }
    }
  );
});

//Delete one restaurant
app.delete("/restaurants/:id", (req, res) => {
  connection.query(
    "DELETE FROM Restauranttable WHERE idRestaurants = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        console.log("Entering delete request");
        res.status(200).redirect("/");
        console.log("Deleted successfully");
      } else {
        console.log(err);
      }
    }
  );
});

//Add a restaurant
app.post("/restaurants", (req, res) => {
  console.log("Entering the post-method in appjs");
  let r = req.body;
  //Calling stored procedure
  let sp =
    "SET @idRestaurants = ?; SET @Name = ?; SET @Area = ?; SET @Cuisine = ?; SET @Price = ?; \
  CALL restaurant_add(@idRestaurants, @Name, @Area, @Cuisine, @Price);";
  connection.query(
    sp,
    [r.idRestaurants, r.Name, r.Area, r.Cuisine, r.Price],
    (err, rows, fields) => {
      if (!err) {
        rows.forEach(element => {
          if (element.constructor == Array)
            console.log(
              "The added restaurant id is " + element[0].idRestaurants
            );
        });
        res.status(200).redirect("/");
        //connection.end();
      } else {
        console.log(err);
      }
    }
  );
});

//Update a restaurant
app.put("/restaurants", (req, res) => {
  let r = req.body;
  console.log("Entering the put request");
  console.log(r);
  //Calling stored procedure
  let sp =
    "SET @idRestaurants = ?; SET @Name = ?; SET @Area = ?; SET @Cuisine = ?; SET @Price = ?; \
  CALL restaurant_add(@idRestaurants, @Name, @Area, @Cuisine, @Price);";
  connection.query(
    sp,
    [r.idRestaurants, r.Name, r.Area, r.Cuisine, r.Price],
    (err, rows, fields) => {
      if (!err) {
        console.log("Updated successfully");
        res.status(200).redirect("/");
      } else {
        console.log(err);
      }
    }
  );
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/restaurants", restaurantsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Setting up the server
app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});

module.exports = app;
