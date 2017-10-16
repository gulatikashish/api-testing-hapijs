

var user = require('../schema/users');
var questions = require('../schema/questions');
var helper = require('../helper/userHeplerFunction');
var crypto = require('crypto');
var is = require('is')
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var moment = require('moment');
var mongoose=require('mongoose')

/* GET home page. */


const ADD_USER = (req, res, next) => {
    const url = req.connection.info.protocol
        + '://'
        + req.info.host
    console.log("rew", req.connection.info.protocol + '://'
        + req.info.host)
    var obj = req.payload;
    var hash = crypto.createHash('md5').update(obj.password).digest('hex');
    var utc = new Date();
    utc.setHours(utc.getHours() + 5);
    var date = new Date(); //2017-04-25T06:23:36.510Z
    var d = date.toLocaleTimeString();

    //console.log(d);
    var usr = new user({
        name: obj.name,
        email_id: obj.email_id,
        password: hash,
        role: obj.role,
        created_at: moment(new Date()).utcOffset(330).format('llll'),
        updated_at: moment(new Date()).utcOffset(330).format('llll'),
    });
    //console.log("==momrnt===", moment())
    usr.save(function (err, usr) {
        if (err) {
            res({ msg: err }).code(400);
        } else {
            helper.verify_email(obj, usr._id, url, function (response) { })
            //console.log("user", usr)
            res({ msg: "inserted", data: usr }).code(200);
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
            res({ status: 0, msg: err }).code(400);
        }
        else {
            res({ status: 1, msg: rest }).code(200);
        }
    })
}
const UPDATE_USER = (req, res, next) => {
    var err = [];
    var obj = req.payload
    //console.log("req", req.payload)
    var check = { '_id': obj.user_id };
    var data = req.payload;
    if (obj.password) {
        var hash = crypto.createHash('md5').update(obj.password).digest('hex');
        data.password = hash
    }
    obj.updated_at = moment(new Date()).utcOffset(-330).format('llll');
    user.findOneAndUpdate(check, obj, { new: true }).exec(function (err, result) {
        if (err) {
            res({ msg: err });
        }
        else {
            if (result == null) {
                res({ msg: "no such id exist" }).code(400);
            }
            else {
                res({ msg: "updated", data: result }).code(200);
            }
        }
    })
}

const DELETE_USER = (req, res, next) => {
    var err = [];
    var obj = req.payload
    //console.log("objjjj", obj)
    if (is.undefined(obj.user_id) || is.empty(obj.user_id)) {
        err.push('user_id is required');
    }
    user.find({ "_id": obj.user_id }).remove().exec(function (err, result) {
        if (err) {
            res({ msg: err }).code(400);
        }
        else {
            res({ msg: "deleted" }).code(200);
        }
    })
}
const SIGN_IN = (req, res, next) => {
    var secret = config.secret;
    var obj = req.payload;
    user.findOne({ 'email_id': obj.email_id }).exec(function (err, result) {

        if (err) {
            res({ status: 0, msg: "Error in finding this user in our database, please try again later. " }).code(400)
            return;
        } else if (!result) {
            res({ status: 0, msg: "No such user exists in our database" }).code(400)
            return;
        }
        else if (result.is_email_verified == 0) {
            res({ status: 0, msg: "Please verify your email" }).code(400)
            return;
        }
        else {

            if (crypto.createHash('md5').update(obj.password).digest('hex') == result.password) {

               // console.log("===", result, secret)
                // var token = jwt.sign({
                //   email_id:obj.email_id
                //   }, secret);
                // var token = jwt.sign({ id: result._id, name: result.name, email_id: result.email_id }, "secret", { expiresIn: "1h" });
                var token = jwt.sign({
                    data: 'foobar'
                }, 'secret', { expiresIn: '1h' });
                // jwt.sign({ foo: 'bar' }, secret, { algorithm: 'RS256' }, function(err, token) {
                //     console.log("===",token);
                //   });
               // console.log(token)
                res({ status: 1, data: result, token: token }).code(200)
            } else {
                res({ status: 0, msg: "You have entered wrong email or password" }).code(400)
                return;
            }
        }
    });
}
const UPDATE_USERSS = (req, res, next) => {
    console.log("-===========headers===",req.headers.authorization)
    var token = req.headers.authorization;
    var secret = config.secret
   // jwt.verify(token, secret.toString(), function (err, decoded) {
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err) {
            res({status:0,msg:"invalid token"}).code(400);
            return;
        } else {
            var err = [];
            var obj = req.payload
            var check = { '_id': obj.user_id };
            var data = req.payload;
            if (obj.password) {
                var hash = crypto.createHash('md5').update(obj.password).digest('hex');
                data.password = hash
            }
            user.findOneAndUpdate(check, data, { new: true }).exec(function (err, result) {
                if (err) {
                    res({ msg: err });
                    return;
                }
                else {
                    if (result == null) {
                        res({ msg: "no such id exist" });
                        return
                    }
                    else {
                        res({ msg: "updated", data: result });
                    }
                }
            })
       }
   });
}
const LOGIN = (req, res, next) => {
    // var obj=req.payload;
    var data = "";
    var email = req.query.email;
    var verify = req.query.verify;
    user.findOne({ 'email_id': email }).exec(function (error, eres) {
        if (error) {
            res({ msg: err });
        } else if (!eres) {
            console.log("eressssss", eres)
        } else if (crypto.createHash('md5').update(eres.email_verification_code).digest('hex') != verify) {
            console.log("eresssssssssssss---------", verify)
            res.view('email_verification', {
                data: "Sorry,error in verification process"
            })
        } else {
            var check = { 'email_id': email };
            var data = { is_email_verified: '1', email_verification_code: 0 };
            user.findOneAndUpdate(check, data, function (uperr, upresp) {
                if (uperr) {
                    res.view('email_verification', {
                        data: "Sorry,error in verification process"
                    })
                } else {
                    res.view('email_verification', {
                        data: "EMAIL VERIFIED SUCCESSFULLY!!!!"
                    })
                }

            })
        }

    })
}
const FORGOT_PASSWORD = (req, res, next) => {
    const url = req.connection.info.protocol
        + '://'
        + req.info.host
    console.log("rew", req.connection.info.protocol + '://'
        + req.info.host)
    //console.log("ressssssss-------------------==============sss")
    var obj = req.payload;
    var err = [];
    user.findOne({ 'email_id': obj.email_id }).exec(function (err, result) {
        // console.log("ressssssss-------------------sss", result[0].auth_type)
        if (err) {
            res({ status: 0, msg: "Error in finding this user in our database, please try again later. " }).code(400);
            return;
        } else if (!result) {
            res({ status: 0, msg: "No such user exists in our database" }).code(400);
            return;
        } else {
            helper.forgotpass_email(obj, result._id, url, function (response) { })

            res({ status: 1, msg: "password has been sent to email!" }).code(200);
        }
    });
};
const CHANGE_PASSWORD = (req, res, next) => {
    var obj = req.payload;
    var err = [];


    user.findOne({ 'email_id': obj.email_id }).exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: "Error in finding this user in our database, please try again later. " }).code(400);
            return;
        } else if (!result) {
            res({ status: 0, msg: "No such user exists in our database" }).code(400);
            return;
        }
        else {
            if (crypto.createHash('md5').update(obj.password).digest('hex') == result.password) {
                var new_password = crypto.createHash('md5').update(obj.new_password).digest('hex')
                var check = { 'email_id': obj.email_id };
                var data = { password: new_password };
                user.findOneAndUpdate(check, data, { new: true }).exec(function (uperr, upresp) {
                    if (uperr) {
                        res({ status: 0, msg: uperr }).code(400);
                    }
                    else {
                        res({ status: 1, msg: "Password changed successfully!" }).code(200);
                    }
                })
            }
            else {
                res({ status: 0, msg: "You have entered wrong email or password" }).code(400);
                return;
            }

        }
    });
}
const USER_DETAIL = (req, res, next) => {
    var obj = req.payload;
    //user.findOne({ '_id': obj.user_id }).populate('_id'
    user.aggregate(
      { $match: {_id:mongoose.Types.ObjectId(obj.user_id)}},
        {
            $lookup:
            {
                from: "questions",
                localField: "_id",
                foreignField: "instructor_id",
                as: "questions"
            }
        }
    ).exec(function (err, result) {
       // console.log(result)
        if (err) {
            res({ status: 0, msg:err }).code(400);
            return;
        } else if (!result) {
            res({ status: 0, msg: "No such user exists in our database" }).code(400);
            return;
        }
        else {
            res({ status: 1, data: result }).code(200);
            return;
        }


    })
}
module.exports = {

    GET_USER: GET_USER,
    ADD_USER: ADD_USER,
    UPDATE_USER: UPDATE_USER,
    DELETE_USER: DELETE_USER,
    SIGN_IN: SIGN_IN,
    UPDATE_USERSS: UPDATE_USERSS,
    LOGIN: LOGIN,
    FORGOT_PASSWORD: FORGOT_PASSWORD,
    CHANGE_PASSWORD: CHANGE_PASSWORD,
    USER_DETAIL: USER_DETAIL
}
