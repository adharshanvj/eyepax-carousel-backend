const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const carouselRoutes = express.Router();
const PORT = 3600;

let Carousel = require("./carousel.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/carousel", {
  useNewUrlParser: true,
});
const connection = mongoose.connection;

/* Endpoint - Get all carousels with limit */
carouselRoutes.route("/").get(function (req, res) {
  //Get slides limit from URL query params
  let slideLimit = 10;

  const queryParams = req.query;

  if (Object.keys(queryParams).length > 0) {
    slideLimit =
      Object.keys(queryParams)[0] == "slides"
        ? parseInt(queryParams.slides)
        : 10;
  }

  console.log("slides limit: ", slideLimit);

  Carousel.find((err, carousels) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      res.json(carousels);
    }
  }).limit(slideLimit);
});

/* Endpoint - Add carousel object to DB */
carouselRoutes.route("/add").post(function (req, res) {
  let carouselItem = new Carousel(req.body);
  carouselItem
    .save()
    .then((todo) => {
      console.log("Inserted successfully!");
      res.status(200).json({ todo: "Carousel details added successfully" });
    })
    .catch((err) => {
      res.status(400).send("Adding new carousel details failed!");
    });
});

/* Endpoint - Edit carousel object */
carouselRoutes.route("/update/:id").post(function (req, res) {
  Carousel.findById(req.params.id, function (err, carousel) {
    if (!carousel) {
      res.status(404).send("Data not found");
    } else {
      carousel.image = req.body.image;
      carousel.title = req.body.title;
      carousel.subTitle = req.body.subTitle;

      carousel
        .save()
        .then((carousel) => {
          res.json("Carousel details updated!");
        })
        .catch((err) => {
          res.status(400).send("Updated failed!");
        });
    }
  });
});

app.use("/api/carousels", carouselRoutes);

app.listen(PORT, function () {
  console.log("Server is running on port ", PORT);
});
