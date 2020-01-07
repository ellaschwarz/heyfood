//Making sure users can not access information without logging in
module.exports = {
    checkAuthenticated: function (req, res, next) {
     if (req.isAuthenticated()) {
       return next()
     }
     res.redirect('/login')
   }

}
   /* --------------------------------------------------------------*/
   