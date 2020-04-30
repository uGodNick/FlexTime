const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const ContentSchema = new Schema(
  {
    keys: [{ type: String}],
    content: [{ type: String }]
  }
);



module.exports = mongoose.model('Content', ContentSchema);
