const mongoose = require('mongoose');

const { Schema } = mongoose;

const shopSchema = new Schema({
  shopName: {
    type: String,
    required: true
  },
  shopAddress: {
    type: String,
    required: true
  },
  shopTel: {
    type: String,
    required: true
  },
  representative: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Shop', shopSchema);
