const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, max: 30 },
    author: { type: Schema.ObjectId, ref: 'User' },
    create_date: { type: Date, default: Date.now },
    theme: { type: String, required: true, enum: ['music', 'health', 'other'] }
  }
);

CourseSchema
  .virtual('url')
  .get(function () {
    return '/courses/course' + this._id;
  });

CourseSchema
  .virtual('create_date_formatted')
  .get(function () {
    return moment(this.due_back).format('MMMM Do, YYYY');
  });

module.exports = mongoose.model('course', CourseSchema);
