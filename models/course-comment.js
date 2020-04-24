const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: { type: Schema.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 500 },
    create_date: { type: Date, default: Date.now },
    course: { type: Schema.ObjectId, ref: 'Course' }
  }
);

CommentSchema
  .virtual('create_date_formatted')
  .get(function () {
    return moment(this.create_date).format('MMMM DD, YYYY');
  });

module.exports = mongoose.model('Comment', CommentSchema);
