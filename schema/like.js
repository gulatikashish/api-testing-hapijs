var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var like = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    question_id:{ type: Schema.Types.ObjectId, ref: 'questions', default: null },
    created_at:{type: String},//+7*24*60*60*1000
    
}, { collection: 'like' });

module.exports = mongoose.model('like', like);
