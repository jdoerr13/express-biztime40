/** BizTime express application. */


const express = require("express");
const app = express();
const ExpressError = require("./expressError")
const cRoutes = require("./routes/companies");
const iRoutes = require("./routes/invoices");
const industryRoutes = require("./routes/industries");

app.use(express.json());
app.use("/companies", cRoutes);//use /companies for all the routes mounted by cRoutes variable
app.use("/invoices", iRoutes);
app.use("/industries", industryRoutes);


/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

//ADDED THIS TEMPORARILY
// app.listen(3000, function () { 
//   console.log("Server started on 3000");
// });


module.exports = app;
