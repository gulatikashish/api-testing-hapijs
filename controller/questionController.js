
var questions = require('../schema/questions');
var like = require('../schema/like')

var moment = require('moment')
var mongoose = require('mongoose')
/* GET home page. */

/**
 * Add questions.
 * @param {string} user_id - user_id of the user
 * @param {string} question_nam - name of the question
 * @param {string} question_type -type of the question
 * @param {string} role - role of the user .
 */
const ADD_QUESTION = (req, res, next) => {
    var obj = req.payload;
    var err = [];

    var q = new questions({
        name: obj.question_name,
        type: obj.question_type,
        instructor_id: obj.user_id,
        created_at: moment(new Date()).utcOffset(+330).format('llll'),
        updated_at: moment(new Date()).utcOffset(+330).format('llll')
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
/**
 * get the list of all the questions with pagination 
 */
const GET_ALL_QUESTION = (req, res, next) => {
    console.log("reqq", req.payload)
    var pg = req.payload.page;
    var limit = 5;
    var skip = limit * pg
    questions.find({}, {}, { limit: limit, skip: skip }).populate('instructor_id').exec(function (err, rest) {
        // questions.aggregate([
        //     {
        //         $lookup:
        //         {
        //             from: "users",
        //             localField: "instructor_id",
        //             foreignField: "_id",
        //             as: "users"
        //         }
        //     }
        // ], function (err, rest) {
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

/**
 * get the list of all questions without pagination 
 */
const GET_QUESTION = (req, res, next) => {
    //questions.find({}) .sort('field -created_at').exec(function (err, rest) {
        
           // console.log("resulkt",result)
    questions.aggregate([
        {
            $lookup:
            {
                from: "users",
                localField: "instructor_id",
                foreignField: "_id",
                as: "users"
            },


        },

        { $sort: { created_at: 1 } }

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

/**
 * update the question on the basis of question id 
 * @param {string} question_id - id of the question.
 * @param {string} name  - name of the question 
 * @param {string} type - type of the question
 */
const UPDATE_QUESTION = (req, res, next) => {
    var err = [];
    var obj = req.payload
    var date = moment().toLocaleString()
    var check = { '_id': obj.question_id };
    var data = req.payload;
    obj.updated_at = moment(new Date()).utcOffset(-330).format('llll');
    // console.log(obj)
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

/**
 * delete the question on the basis of question id 
 * @param {string} question_id-id of the question
 */
const DELETE_QUESTION = (req, res, next) => {
    var err = [];
    var obj = req.payload
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

/**
 * get the details of the particular question on the basis of id
 * @param {string} question_id-id of the question
 */
const QUESTION_DETAIL = (req, res, next) => {
    var obj = req.payload;
    // user.findOne({ '_id': obj.user_id }).populate('_id').exec(
    questions.aggregate(
        { $match: { _id: mongoose.Types.ObjectId(obj.question_id) } },
        {
            $lookup:
            {
                from: 'users',
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

/**
 * search the questions on the basis of the type
 * @param {string} question_type -type of the question
 */
const TYPE_DETAIL = (req, res, next) => {
    var obj = req.payload;
    // user.findOne({ '_id': obj.user_id }).populate('_id').exec(
    questions.aggregate(
        { $match: { type: obj.question_type } },
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
            res({ status: 0, msg: "No Such type exist in the database" }).code(400);
            return;
        }
        else {
            res({ status: 1, data: result }).code(200);
            return;
        }
    })
}

/**
 * like the question 
 * @param {string} user_id -id of the user 
 * @param {string} question_id - id of the question
 */
function LIKE_QUESTION(req, res, next) {
    var obj = req.payload;
    var err = [];
    var l = new like({
        question_id: obj.question_id,
        user_id: obj.user_id,
        created_at: moment(new Date()).utcOffset(+330).format('llll'),
    });
    like.find({ "question_id": obj.question_id, "user_id": obj.user_id }).exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: err }).code(400)
            return;
        }
        else if (result[0]) {
            res({ status: 0, msg: "Already liked" }).code(400)
        }
        else {
            questions.findOneAndUpdate({"_id":obj.question_id}, {$inc: { likes: 1}}, { new: true }).exec(function (err, result) {
            l.save(function (errr, usrr) {
                if (errr) {
                    res({ status: 0, msg: errr }).code(400)
                    return;
                }
                else {
                    res({ status: 1, msg: "inserted", data: usrr }).code(200)
                    return;
                }
            })
        })
        }
    })
}
// async function check_like(obj){
//     console.log("---------------------")
//     var rest;
//     await like.findOne({ "question_id": obj.question_id, "user_id": obj.user_id }).exec(function (err, result) {
//         // if (err) {
//         //     console.log("ERROR")
//         //     return 0;
//         // }
//         // else {
//             console.log("RESULT ")
//             console.log("==================", result)
//             return 1;
//             rest=result
//         // }
//     });


//}

module.exports = {
    GET_QUESTION: GET_QUESTION,
    ADD_QUESTION: ADD_QUESTION,
    UPDATE_QUESTION: UPDATE_QUESTION,
    DELETE_QUESTION: DELETE_QUESTION,
    QUESTION_DETAIL: QUESTION_DETAIL,
    GET_ALL_QUESTION: GET_ALL_QUESTION,
    TYPE_DETAIL: TYPE_DETAIL,
    LIKE_QUESTION: LIKE_QUESTION
}