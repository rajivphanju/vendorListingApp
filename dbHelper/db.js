const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/vendorListingApp";
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

connect.then(
  db => {
    console.log(
      "Connected to mongodb server at port 3000 with db name vendorListingApp"
    );
  },
  err => {
    console.log(err);
  }
);