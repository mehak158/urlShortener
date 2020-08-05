const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
 
   full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  unique_name : {
    type : String,
    required : false
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  expiryDate: { 
    type: Date,
    default: Date.now ,
    index: { expires: 0 },
  }
},
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ShortUrl', shortUrlSchema)