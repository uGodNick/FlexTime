const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, max: 50 },
    author: { type: Schema.ObjectId, ref: 'User' },
    create_date: { type: Date, default: Date.now },
    theme: { type: String, required: true, enum: ['music', 'health', 'other'] },
    content: { type: Schema.ObjectId, ref: 'Content' },
    comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
    like_by: [{ type: Schema.ObjectId, ref: 'User' }],
    dislike_by: [{ type: Schema.ObjectId, ref: 'User' }],
    rating: { type: Number, default: 0}
  }
);

CourseSchema
  .virtual('url')
  .get(function () {
    return 'course' + this._id;
  });

CourseSchema
  .virtual('create_date_formatted')
  .get(function () {
    return moment(this.create_date).format('MMMM Do, YYYY');
  });

module.exports = mongoose.model('Course', CourseSchema);
