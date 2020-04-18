const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, min: 1, max: 30 },
    password: { type: String, required: true, min: 8, max: 24 },
    email: { type: String, required: true },
    register_date: { type: Date, default: Date.now },
    last_active_date: { type: Date },
    rating: { type: Number, default: 0 },
    admin_root: { type: Boolean, default: false}
  }
);

UserSchema
  .virtual('url')
  .get(function () {
    return 'users/user' + this._id;
  });

UserSchema
  .virtual('register_date_formatted')
  .get(function () {
    return moment(this.register_date).format('DD/MM/YYYY');
  });

UserSchema
  .virtual('last_active_date_formatted')
  .get(function () {
    return moment(this.last_active_date).format('DD/MM/YYYY');
  });

module.exports = mongoose.model('User', UserSchema);
