"use strict";

const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  Subscriber = require("./models/subscriber"),
  router=express.Router();
mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());
router.use(homeController.logRequestPaths);

router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/courses", coursesController.index, coursesController.indexView);
router.get('/users/new',usersController.new);
router.post('/users/create',usersController.create,usersController.redirectView)


router.post("/subscribe", subscribersController.saveSubscriber);
router.get('/users/:id',usersController.show,usersController.showView)

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);
app.use('/',router)


app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
