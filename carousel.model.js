const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Carousel = new Schema({
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  subTitle: {
    type: String,
  },
});

module.exports = mongoose.model("Carousel", Carousel);
