const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: String,
});

module.exports = mongoose.model("Category", categorySchema);
