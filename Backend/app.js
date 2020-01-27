const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const categoriesRouter = require("./routes/categories");
const subcategoriesRouter = require("./routes/subcategories");
const itemsRouter = require("./routes/items");
const path = require("path");

mongoose.connect('mongodb+srv://nareman:7QORPYtNi2ZAvwnx@cluster0-v4jki.mongodb.net/node-angular?retryWrites=true&w=majority',
  { useNewUrlParser: true }).then(
    () => {
      console.log('connected to database');

    }).catch(
      (error) => {
        console.error(error)
        console.log('Exception while connecting to database');
      }
    );
const User = require('./models/users');
// const Category = require('./models/categories');
// const SubCategory = require('./models/subcategories');
// const Item = require('./models/items');


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/catimages", express.static(path.join("backend/images/categories")));
app.use("/subcatimages", express.static(path.join("backend/images/subcategories")));
app.use("/itemimages", express.static(path.join("backend/images/items")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/categories", categoriesRouter);
app.use("/api/subcategories", subcategoriesRouter);
app.use("/api/items", itemsRouter);

app.post("/create/user", (req, res, next) => {
  const user = User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type
  });
  console.log(user);
  user.save().then(storUser => {
    res.status(200).json({
      userid: storUser.id
    });
  });
});


module.exports = app;
