const express =  require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require('body-parser');
const cors = require("cors");
const mongoose = require("./dbHelper/db");

const siteRoute = require("./routes/site");
const usersRoute = require("./routes/user");



app.use(morgan("dev"));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cors());
app.use('/uploads', express.static('./public/uploads'));


app.use("/site", siteRoute);
app.use("/user", usersRoute);




//for handliing cors errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE");
      return res.status(200).json({});
    }
    next();
  });



  //error handling
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  module.exports = app;