const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mysql = require("mysql");

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

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    //Get user by email to check if correct when logging in
    const user = getUserByEmail(email);
    console.log(getUserByEmail)
    console.log('---')
    console.log(email)
    connection.query("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      console.log(user[0]);
      console.log('Checking checking')
      console.log(password);
      //Checking if we have a user
      if (user[0] == null) {
        return done(null, false, { message: "No user with that email" });
      }
      //Checking if password is matching the email
      //try {
      bcrypt.compare(password, user[0].password, (err, matching) => {
        console.log('Entering compare')
        if (err) throw err;
        if (matching) {
          console.log("Username and password matches");
          return done(null, user[0]);
        } else {
          console.log("Password incorrect");
          return done(null, false, { message: "Password incorrect" });
        }
      });

      // } catch (e) {
      //    //Catching err
      //    return done(e)
      // }
    });
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  //Serialize and deserialize user to store into the session
  passport.serializeUser( (user, done) => {
      console.log('SERIALIzEEEE')
    done(null, user.idusers);
  })

  passport.deserializeUser( (id, done) => {
    console.log('DESERIALIzEEEE')
    connection.query('SELECT * FROM users WHERE idusers = ?' , [id], (err, user) => {
        return done(null, user[0]);
    })
    
  })

}

module.exports = initialize;
