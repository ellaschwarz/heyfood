//This loads in our different environment variables and set them in process.env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

//For passport and configuration
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const app = express();
const PORT = process.env.PORT || 3000;

const allRestaurants = [];
const users = [];

//Connection to restaurant database
var connection = mysql.createConnection({
  host: "xav-p-mariadb01.xavizus.com",
  user: "ella",
  password: "xdWThTEK9bMxqLXk",
  database: "ella",
  port: 16200,
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
const reviewsRouter = require("./routes/reviews");

/* ------------------------------------------------------------------------------------*/

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
//For body parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

//For passport
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

//For using put and delete in html-form
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

/*-----------------------------------------------------------------------------------------------*/

//Get restaurants
app.get("/restaurants", (req, res) => {
  //Get all restaurants from database
  connection.query("SELECT * FROM Restauranttable", (err, rows, fields) => {
    if (!err) {
      //res.send(rows);
      res.status(200).json(rows);
      allRestaurants.push(rows);
    } else {
      console.log(err);
      return;
    }
  });
});

//Get one restaurant
app.get("/restaurants/:id", (req, res) => {
  connection.query(
    "SELECT * FROM Restauranttable WHERE idRestaurants = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        return res.status(200).json(rows);
        //res.json(rows);
        //return;
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

/* ---------------------------------------------------------------------------------------- */
//Routing for login and register

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, (req, res) => {
  console.log("Entering the post for registration");
  let r = req.body;
  console.log(req.body);
  // //Hashing password with 10 generaded hashes to make it secure
  bcrypt.hash(r.password, 10, (err, hashedPassword) => {
    //Calling stored procedure
    let sp =
      "SET @idusers = ?; SET @username = ?; SET @email = ?; SET @password = ?; \
  CALL user_add(@idusers, @username, @email, @password);";
    connection.query(
      sp,
      [r.idusers, r.username, r.email, hashedPassword],
      (err, rows, fields) => {
        if (!err) {
          rows.forEach(element => {
            if (element.constructor == Array)
              console.log("The added user id is " + element[0].idusers);
          });
          res.status(200).redirect("/login");
          //connection.end();
        } else {
          console.log(err);
          res.redirect("/register");
        }
      }
    );
  });
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("login");
});

/* ---------------------------------------------------------------------------------------*/
//Making sure the users doesn't have to sign in again once they are authenticated
//The function that is checking if the user actually is authenticated can be found in the passport-folder

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

/* ---------------------------------------------------------------------------------------*/
//Routing for reviews

//Get reviews
app.get("/reviews", (req, res) => {
  //Get all restaurants from database
  connection.query("SELECT * FROM Reviews rev INNER JOIN Restauranttable res ON rev.idRestaurants = res.idRestaurants ORDER BY res.idRestaurants", (err, rows, fields) => {
    if (!err) {
      //res.send(rows);
      res.status(200).json(rows);
    } else {
      console.log(err);
      return;
    }
  });
});

//Get rating
app.get("/reviews/avgrates", (req, res) => {
  //Get all restaurants from database
  connection.query(" SELECT idRestaurants, round(avg(Rateing), 2) as Avg_Rateing FROM ella.Reviews GROUP BY Reviews.idRestaurants;", (err, avg, fields) => {
    if (!err) {
      //res.send(rows);
      res.status(200).json(avg);
    } else {
      console.log(err);
      return;
    }
  });
});

//Add a review
app.post("/reviews", (req, res) => {
  console.log("Entering the post-method for reviews");
  let r = req.body;
  console.log(req.body);
  //Calling stored procedure
  let sp =
    "SET @idReviews = ?; SET @idRestaurants = ?; SET @username = ?; SET @Rateing = ?; SET @Comment = ?; \
  CALL review_add(@idReviews, @idRestaurants, @username, @Rateing, @Comment);";
  connection.query(
    sp,
    [r.idReviews, r.idRestaurants, r.username, r.Rateing, r.Comment],
    (err, rows, fields) => {
      if (!err) {
        rows.forEach(element => {
          if (element.constructor == Array)
            console.log(
              "The added reviews id is " + element[0].idReviews
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


/* ---------------------------------------------------------------------------------------*/

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);

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
app.listen(process.env.PORT || PORT, () => {
  console.log("Listening on port: " + PORT);
});

module.exports = app;
