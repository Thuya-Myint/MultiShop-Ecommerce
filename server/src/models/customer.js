const mongoose = require("mongoose");
const customerModelSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imgSrc: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);
const Customer = mongoose.model("customer", customerModelSchema);
module.exports = Customer;
