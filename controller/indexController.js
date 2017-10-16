
var express = require('express');
var router = express.Router();
var user = require('../schema/users');
var questions = require('../schema/questions');
var crypto = require('crypto');
var is = require('is')
/* GET home page. */


const ADD_QUESTION = (req, res, next) => {
    var obj = req.body;
    var err = [];
    if (is.undefined(obj.user_id) || is.empty(obj.user_id)) {
        err.push('user_id is required');
    }
    if (is.undefined(obj.question_name) || is.empty(obj.question_name)) {
        err.push('question_name is required');
    }
    if (is.undefined(obj.question_type) || is.empty(obj.question_type)) {
        err.push('question_type is required');
    }
    if (!is.empty(err)) {
        res.status(400).send({ status: 0, msg: err });
        return;
    }
    var q = new questions({
        name: obj.question_name,
        type: obj.question_type,
        instructor_id: obj.user_id,
    });
    q.save(function (errr, usrr) {
        if (errr) {
            res.status(400).send({ status: 0, msg: errr });
        }
        else {
            res.status(200).send({ status: 1, msg: "inserted" });
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
            res.status(500).send({ status: 0, msg: err });
        }
        else {
            res.status(200).send({ status: 1, msg: rest });
        }
    })
}

const UPDATE_QUESTION = (req, res, next) => {
    var err = [];
    var obj = req.body
    if (is.undefined(obj.question_id) || is.empty(obj.question_id)) {
        err.push('question_id is required');
    }
    var check = { '_id': obj.question_id };
    var data = req.body;
    questions.findOneAndUpdate(check, data, { new: true }).exec(function (err, result) {
        if (err) {
            res.status(500).send({ status: 0, msg: err });
        }
        else {
            res.status(200).send({ status: 1, msg: "updated" });
        }
    })
}
const DELETE_QUESTION = (req, res, next) => {
    var err = [];
    var obj = req.body

    if (is.undefined(obj.question_id) || is.empty(obj.question_id)) {
        err.push('question_id is required');
    }
    questions.find({ "_id": obj.question_id }).remove().exec(function (err, result) {
        if (err) {
            res.status(500).send({ status: 0, msg: err });
        }
        else {
            res.status(200).send({ status: 1, msg: "deleted" });
        }
    })
}


const ADD_USER = (req, res, next) => {
    var obj = req.body;
    var err = [];
    if (is.undefined(obj.name) || is.empty(obj.name)) {
        err.push("Name is required");
    }
    if (is.undefined(obj.email_id) || is.empty(obj.email_id)) {
        err.push('Email is required');
    }
    if (is.undefined(obj.password) || is.empty(obj.password)) {
        err.push('password is required');
    }
    if (is.undefined(obj.role) || is.empty(obj.role)) {
        err.push('role is required');
    }
    if (!is.empty(err)) {
        res.status(400).send({ status: 0, msg: err });
        return;
    }
    var hash = crypto.createHash('md5').update(obj.password).digest('hex');
    var usr = new user({
        name: obj.name,
        email_id: obj.email_id,
        password: hash,
        role: obj.role
    });
    usr.save(function (err, usr) {
        if (err) {
            res.status(400).send({ status: 0, msg: err });
        } else {
            res.status(200).send({ status: 1, msg: "inserted" });
        }
    })
}

const GET_USER = (req, res, next) => {
    user.aggregate([
        {
            $lookup:
            {
                from: "questions",
                localField: "_id",
                foreignField: "instructor_id",
                as: "questions"
            }
        }
    ], function (err, rest) {
        if (err) {
            res.status(500).send({ status: 0, msg: err });
        }
        else {
            res.status(200).send({ status: 1, msg: rest });
        }
    })
}
const UPDATE_USER = (req, res, next) => {
    var err = [];
    var obj = req.body
    if (is.undefined(obj.user_id) || is.empty(obj.user_id)) {
        err.push('user_id is required');
    }
    var check = { '_id': obj.user_id };
    var data = req.body;
    if (obj.password) {
        var hash = crypto.createHash('md5').update(obj.password).digest('hex');
        data.password = hash
    }
    user.findOneAndUpdate(check, data, { new: true }).exec(function (err, result) {
        if (err) {
            res.status(500).send({ status: 0, msg: err });
        }
        else {
            if (result == null) {
                res.status(500).send({ status: 0, msg: "no such id exist" });
            }
            else {
                res.status(200).send({ status: 1, msg: "updated", data: result });
            }
        }
    })
}

const DELETE_USER = (req, res, next) => {
    var err = [];
    var obj = req.body
    if (is.undefined(obj.user_id) || is.empty(obj.user_id)) {
        err.push('user_id is required');
    }
    user.find({ "_id": obj.user_id }).remove().exec(function (err, result) {
        if (err) {
            res.status(500).send({ status: 0, msg: err });
        }
        else {
            res.status(200).send({ status: 1, msg: "deleted", data: result });
        }
    })
}

module.exports = {
    GET_QUESTION: GET_QUESTION,
    ADD_QUESTION: ADD_QUESTION,
    UPDATE_QUESTION: UPDATE_QUESTION,
    DELETE_QUESTION: DELETE_QUESTION,
    GET_USER: GET_USER,
    ADD_USER: ADD_USER,
    UPDATE_USER: UPDATE_USER,
    DELETE_USER: DELETE_USER,
}