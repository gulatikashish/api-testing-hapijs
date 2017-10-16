var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questions = new Schema({
    name: String,
    type: { type: String },
    instructor_id: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    created_at:{type: String},//+7*24*60*60*1000
    updated_at:{type: String }
}, { collection: 'questions' });

module.exports = mongoose.model('questions', questions);
