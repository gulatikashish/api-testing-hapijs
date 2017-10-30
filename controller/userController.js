var user = require('../schema/users')
var like=require('../schema/like')
//var rating = require('../schema/rating')
var helper = require('../helper/userHeplerFunction')
var crypto = require('crypto')
var is = require('is')
var jwt = require('jsonwebtoken')
var config = require('../config/config')
var moment = require('moment')
var mongoose = require('mongoose')
/* GET home page. */
/**
 * Add user.
 * @param {string} name - name of the user.
 * @param {string} email_id - emai id of the user
 * @param {string} password - password of the user
 * @param {string} role - role of the user .
 */
// eslint-disable-next-line
const ADD_USER = (req, res) => {
    const url = req.connection.info.protocol
        + '://'
        + req.info.host
    var obj = req.payload
    var hash = crypto.createHash('md5').update(obj.password).digest('hex')
    var utc = new Date()
    utc.setHours(utc.getHours() + 5)
    var usr = new user({
        name: obj.name,
        email_id: obj.email_id,
        password: hash,
        role: obj.role,
        created_at: moment(new Date()).utcOffset(330).format('llll'),
        updated_at: moment(new Date()).utcOffset(330).format('llll'),
    })
    usr.save(function (err, usr) {
        if (err) {
            res({ msg: err }).code(400)
        } else {
            // eslint-disable-next-line
            helper.verify_email(obj, usr._id, url, function (response) { })
            //console.log("user", usr)
            res({ msg: 'inserted', data: usr }).code(200)
        }
    })
}

/**
 * get user.
 */
// eslint-disable-next-line
const GET_USER = (req, res, next) => {
    user.aggregate([
        {
            $lookup:
            {
                from: 'questions',
                localField: '_id',
                foreignField:'instructor_id',
                as: 'questions'
            }
        }
    ], function (err, rest) {
        if (err) {
            res({ status: 0, msg: err }).code(400)
        }
        else {
            res({ status: 1, msg: rest }).code(200)
        }
    })
}

/**
 * update user.
 * @param {string} user_id - id of the user.
 * @param {string} name - name of the user
 * @param {string} email_id - email_id of the user
 * @param {string} password - password of the user .
 * @param {string} role- role of the user
 */
// eslint-disable-next-line
const UPDATE_USER = (req, res, next) => {
    var obj = req.payload
    //console.log("req", req.payload)
    var check = { '_id': obj.user_id }
    var data = req.payload
    if (obj.password) {
        var hash = crypto.createHash('md5').update(obj.password).digest('hex')
        data.password = hash
    }
    obj.updated_at = moment(new Date()).utcOffset(-330).format('llll')
    user.findOneAndUpdate(check, obj, { new: true }).exec(function (err, result) {
        if (err) {
            res({ msg: err })
        }
        else {
            if (result == null) {
                res({ msg: 'no such id exist' }).code(400)
            }
            else {
                res({ msg: 'updated', data: result }).code(200)
            }
        }
    })
}


/**
 * delete user.
 * @param {string} user_id - user_id of the user.
 */
// eslint-disable-next-line
const DELETE_USER = (req, res, next) => {
    var err = []
    var obj = req.payload
    //console.log("objjjj", obj)
    if (is.undefined(obj.user_id) || is.empty(obj.user_id)) {
        err.push('user_id is required')
    }
    // eslint-disable-next-line
    user.find({ '_id': obj.user_id }).remove().exec(function (err, result) {
        if (err) {
            res({ msg: err }).code(400)
        }
        else {
            res({ msg: 'deleted' }).code(200)
        }
    })
}
// eslint-disable-next-line
const SIGN_IN = (req, res, next) => {
   // var secret = config.secret
    var obj = req.payload
    user.findOne({ 'email_id': obj.email_id }).exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: 'Error in finding this user in our database, please try again later. ' }).code(400)
            return
        } else if (!result) {
            res({ status: 0, msg: 'No such user exists in our database' }).code(400)
            return
        }
        else if (result.is_email_verified == 0) {
            res({ status: 0, msg: 'Please verify your email' }).code(400)
            return
        }
        else {

            if (crypto.createHash('md5').update(obj.password).digest('hex') == result.password) {

                // console.log("===", result, secret)
                // var token = jwt.sign({
                //   email_id:obj.email_id
                //   }, secret)
                // var token = jwt.sign({ id: result._id, name: result.name, email_id: result.email_id }, "secret", { expiresIn: "1h" })
                var token = jwt.sign({
                    data: 'foobar'
                }, 'secret', { expiresIn: '1h' })
                // jwt.sign({ foo: 'bar' }, secret, { algorithm: 'RS256' }, function(err, token) {
                //     console.log("===",token)
                //   })
                // console.log(token)
                res({ status: 1, data: result, token: token }).code(200)
            } else {
                res({ status: 0, msg: 'You have entered wrong email or password' }).code(400)
                return
            }
        }
    })
}

// eslint-disable-next-line
const UPDATE_USERSS = (req, res, next) => {
    console.log('-===========headers===', req.headers.authorization)
    var token = req.headers.authorization
    var secret = config.secret
    // jwt.verify(token, secret.toString(), function (err, decoded) {
    jwt.verify(token, 'secret', function (err, decoded) {
        if (err) {
            res({ status: 0, msg: 'invalid token' }).code(400)
            return
        } else {
            var err = []
            var obj = req.payload
            var check = { '_id': obj.user_id }
            var data = req.payload
            if (obj.password) {
                var hash = crypto.createHash('md5').update(obj.password).digest('hex')
                data.password = hash
            }
            user.findOneAndUpdate(check, data, { new: true }).exec(function (err, result) {
                if (err) {
                    res({ msg: err })
                    return
                }
                else {
                    if (result == null) {
                        res({ msg: 'no such id exist' })
                        return
                    }
                    else {
                        res({ msg: 'updated', data: result })
                    }
                }
            })
        }
    })
}
// eslint-disable-next-line
const LOGIN = (req, res, next) => {
    // var obj=req.payload
    var data = ''
    var email = req.query.email
    var verify = req.query.verify
    user.findOne({ 'email_id': email }).exec(function (error, eres) {
        if (error) {
            res({ msg: err })
        } else if (!eres) {
            console.log('eressssss', eres)
        } else if (crypto.createHash('md5').update(eres.email_verification_code).digest('hex') != verify) {
            console.log('eresssssssssssss---------', verify)
            res.view('email_verification', {
                data: 'Sorry,error in verification process'
            })
        } else {
            var check = { 'email_id': email }
            var data = { is_email_verified: '1', email_verification_code: 0 }
            user.findOneAndUpdate(check, data, function (uperr, upresp) {
                if (uperr) {
                    res.view('email_verification', {
                        data: 'Sorry,error in verification process'
                    })
                } else {
                    res.view('email_verification', {
                        data: 'EMAIL VERIFIED SUCCESSFULLY!!!!'
                    })
                }

            })
        }

    })
}

/**
 *forgot_password
 * @param {string} email_id - emai id of the user
 */
// eslint-disable-next-line
const FORGOT_PASSWORD = (req, res, next) => {
    const url = req.connection.info.protocol
        + '://'
        + req.info.host
    // console.log('rew', req.connection.info.protocol + '://'
    //     + req.info.host)
    //console.log("ressssssss-------------------==============sss")
    var obj = req.payload
    var err = []
    user.findOne({ 'email_id': obj.email_id }).exec(function (err, result) {
        // console.log("ressssssss-------------------sss", result[0].auth_type)
        if (err) {
            res({ status: 0, msg: 'Error in finding this user in our database, please try again later. ' }).code(400)
            return
        } else if (!result) {
            res({ status: 0, msg: 'No such user exists in our database' }).code(400)
            return
        } else {
            helper.forgotpass_email(obj, result._id, url, function (response) { })

            res({ status: 1, msg: 'password has been sent to email!' }).code(200)
        }
    })
}

/**
 * change password.
 * @param {string} email_id - emai id of the user
 * @param {string} password - old password of the user
 * @param {string} new_password - new password of the user .
 */
// eslint-disable-next-line
const CHANGE_PASSWORD = (req, res, next) => {
    var obj = req.payload
    var err = []
    user.findOne({ 'email_id': obj.email_id }).exec(function (err, result) {
        if (err) {
            res({ status: 0, msg: 'Error in finding this user in our database, please try again later. ' }).code(400)
            return
        } else if (!result) {
            res({ status: 0, msg: 'No such user exists in our database' }).code(400)
            return
        }
        else {
            if (crypto.createHash('md5').update(obj.password).digest('hex') == result.password) {
                var new_password = crypto.createHash('md5').update(obj.new_password).digest('hex')
                var check = { 'email_id': obj.email_id }
                var data = { password: new_password }
                user.findOneAndUpdate(check, data, { new: true }).exec(function (uperr, upresp) {
                    if (uperr) {
                        res({ status: 0, msg: uperr }).code(400)
                    }
                    else {
                        res({ status: 1, msg: 'Password changed successfully!' }).code(200)
                    }
                })
            }
            else {
                res({ status: 0, msg: 'You have entered wrong email or password' }).code(400)
                return
            }

        }
    })
}

/**
 * user details.
 * @param {string} user_id - user_id of the user.
 */
// eslint-disable-next-line
const USER_DETAIL = (req, res, next) => {
    var obj = req.payload
    //user.findOne({ '_id': obj.user_id }).populate('_id'
    user.aggregate(
        { $match: { _id: mongoose.Types.ObjectId(obj.user_id) } },
        {
            $lookup:
            {
                from: 'questions',
                localField: '_id',
                foreignField: 'instructor_id',
                as: 'questions'
            }
        }
    ).exec(function (err, result) {
        // console.log(result)
        if (err) {
            res({ status: 0, msg: err }).code(400)
            return
        } else if (!result) {
            res({ status: 0, msg: 'No such user exists in our database' }).code(400)
            return
        }
        else {
            res({ status: 1, data: result }).code(200)
            return
        }


    })
}
// eslint-disable-next-line
const POST_RATING = (req, res, next) => {
 //   var obj = req.payload
    //console.log(d)
    // var rate = new rating({
    //     user_id: obj.user_id,
    //     question_id: obj.question_id,
    //     star: obj.star,
    // })
    // questions.findOne({ "_id": obj.question_id }).exec(function (error, result) {
    //     console.log(error,result)
    //     if (error) {
    //         res({ msg: error }).code(400)
    //     }
    //     else if(!result)
    //     {
    //         res({ msg: "no such question id exist" }).code(400)
    //     }
    //     else
    //     {
    //         rate.save(function (err, usr) {
    //             if (err) {
    //                 res({ msg: err }).code(400)
    //             } else {
    //                 res({ msg: "inserted", data: usr }).code(200)
    //             }
    //         })
    //     }
    // })


}

/**
 * list of the questions that user has liked.
 * @param {string} user_id - user_id of the user.

 */
// eslint-disable-next-line
const USER_LIKE = (req, res, next) => {
    var obj = req.payload
    // like.aggregate(
    //     { $match: { _id: mongoose.Types.ObjectId(obj.user_id) } },
    //     {
    //         $lookup:
    //         {
    //             from: "user",
    //             localField: "_id",
    //             foreignField: "user_id",
    //             as: "questions"
    //         }
    //     }
    // ).exec(function (err, result) {
   like.find({'user_id': obj.user_id }).populate('question_id').populate('user_id').exec(function (err, result) {
        if (err) {
            res({ msg: err }).code(400)
        }
        else {
            res({ msg: result }).code(200)
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
    USER_DETAIL: USER_DETAIL,
    POST_RATING: POST_RATING,
    USER_LIKE:USER_LIKE
    
}
