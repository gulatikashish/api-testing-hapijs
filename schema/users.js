var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var moment=require('moment')

var userSchema = new Schema({
    name: String,
    role: { type: String },
    password: { type: String },
    email_id: { type: String, required: true ,unique: true,},
    is_email_verified:{ type: Number, default: 0 },//0 for verification pending and 1 for verified
    email_verification_code:{ type: String, default: 0 },
    created_at: { type: Date},
   // created_at:{type: Date , default:moment() },//+7*24*60*60*1000
    updated_at:{type: String}

}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);
