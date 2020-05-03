const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: { type: Schema.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 500 },
    create_date: { type: Date, default: Date.now },
    like_by: [{ type: Schema.ObjectId, ref: 'User' }],
    dislike_by: [{ type: Schema.ObjectId, ref: 'User' }],
    rating: { type: Number, default: 0}
  }
);

CommentSchema
  .virtual('create_date_formatted')
  .get(function () {
    return moment(this.create_date).format('MMMM DD, YYYY');
  });

module.exports = mongoose.model('Comment', CommentSchema);
