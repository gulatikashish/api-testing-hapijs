
var questions = require('../schema/questions');
var is = require('is')
var moment = require('moment')
var mongoose = require('mongoose')
/* GET home page. */


const ADD_QUESTION = (req, res, next) => {
    var obj = req.payload;
    var err = [];

    var q = new questions({
        name: obj.question_name,
        type: obj.question_type,
        instructor_id: obj.user_id,
        created_at: moment(new Date()).utcOffset(-330).format('llll'),
        updated_at: moment(new Date()).utcOffset(-330).format('llll')
    });
    q.save(function (errr, usrr) {
        if (errr) {
            res({ status: 0, msg: errr }).code(400)
            return;
        }
        else {
            res({ status: 1, msg: "inserted", data: usrr }).code(200)
            return;
        }
    })
}

const GET_QUESTION = (req, res, next) => {
    // questions.find({}).populate('instructor_id').exec(function (err, rest) {
    questions.aggregate([
        {
            $lookup:
            {
                from: "users",
                localField: "instructor_id",
                foreignField: "_id",
                as: "users"
            }
        }
    ], function (err, rest) {
        if (err) {
            res({ status: 0, msg: err }).code(400);
            return;
        }
        else {
            res({ status: 1, msg: rest }).code(200)
            return;
        }
    })
}

const UPDATE_QUESTION = (req, res, next) => {
    var err = [];
    var obj = req.payload
    var date = moment().toLocaleString()
    var check = { '_id': obj.question_id };
    var data = req.payload;
    obj.updated_at = moment(new Date()).utcOffset(-330).format('llll');
    console.log(obj)
    questions.findOneAndUpdate(check, obj, { new: true }).exec(function (err, result) {
        // questions.findOneAndUpdate({'_id':data.question_id}, { $set: data}).exec(function (err, result) {
        //questions.findOneAndUpdate(check, data, { new: true }).exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: err }).code(400)
            return;
        }
        else {
            res({ status: 1, msg: "updated", data: result }).code(200)
            return;
        }
    })
}
const DELETE_QUESTION = (req, res, next) => {
    var err = [];
    var obj = req.body
    questions.find({ "_id": obj.question_id }).remove().exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: err }).code(400)
            return;
        }
        else {
            res({ status: 1, msg: "deleted" }).code(200)
            return;
        }
    })
}
const QUESTION_DETAIL = (req, res, next) => {
    var obj = req.payload;
    // user.findOne({ '_id': obj.user_id }).populate('_id').exec(
    questions.aggregate(
        { $match: { _id: mongoose.Types.ObjectId(obj.question_id) } },
        {
            $lookup:
            {
                from: "users",
                localField: "instructor_id",
                foreignField: "_id",
                as: "users"
            }
        }
    ).exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: err }).code(400);
            return;
        } else if (!result[0]) {
            res({ status: 0, msg: "No Such question id exist in the database" }).code(400);
            return;
        }
        else {
            res({ status: 1, data: result }).code(200);
            return;
        }
    })
}

module.exports = {
    GET_QUESTION: GET_QUESTION,
    ADD_QUESTION: ADD_QUESTION,
    UPDATE_QUESTION: UPDATE_QUESTION,
    DELETE_QUESTION: DELETE_QUESTION,
    QUESTION_DETAIL: QUESTION_DETAIL
}