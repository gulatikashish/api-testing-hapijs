var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rating = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    question_id:{ type: Schema.Types.ObjectId, ref: 'users', default: null },
    star:{ type: Number, default: 0 },
    created_at:{type: Date,default:Date.now},//+7*24*60*60*1000
    
}, { collection: 'rating' });

module.exports = mongoose.model('rating', rating);
