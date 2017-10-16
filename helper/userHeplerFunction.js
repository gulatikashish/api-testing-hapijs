var randomize = require('randomatic');
var User = require('../schema/users'); // get our mongoose model
var crypto = require('crypto');
module.exports = {

    verify_email: function (obj, insertid, baseurl, callback) {

        var mailer = require("nodemailer");
//console.log("==verify email")
        if_vf_exists(insertid, function (random_code) {
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "walkwel2@gmail.com",
                    pass: "walkwel12345"
                }
            });
            var hash = crypto.createHash('md5').update(random_code).digest('hex')
            var mail = {
                from: "users <walkwel2@gmail.com>",
                //to: "gdeep.singh@amebasoftwares.com",
                to: obj.email_id,
                subject: "Email Verification Code",
                //text: "Node.js New world for me",
                html: "Hi " + obj.name + ",<br><br>" +
                "Thanks for creating your account with us. One last step required before you login is to verify your email id.<br><br>" +
                "<strong><a href='" + baseurl + "/users/login?verify=" + hash + "&email=" + obj.email_id + "'>Click here to verify your email</a></strong><br>" +
                "<br>Thanks<br>" +
                "walkwel Team"
            }
            smtpTransport.sendMail(mail, function (error, response) {
              //  console.log("=====ERROR===",error,response)
                if (error) {
                    callback(0);
                } else {
                    callback(1);
                }
                smtpTransport.close();
            });
        });
    },
    forgotpass_email: function (obj, callback) {
        console.log("======================================")
        var mailer = require("nodemailer");
        if_email_exists(obj, function (random_code) {
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "walkwel2@gmail.com",
                    pass: "walkwel12345"
                }
            });
            var mail = {
                from: "users <walkwel2@gmail.com>",
                //to: "gdeep.singh@amebasoftwares.com",
                to: obj.email_id,
                subject: "Password Reset Verification",
                //text: "Node.js New world for me",
                html: "Hi " + obj.name + ",<br><br>" +
                "We have received password reset request for your account on HealthClub. Here is the code you can use to reset your password: <strong>" + random_code + "</strong><br>" +
                "<br>Thanks<br>" +
                "walkwel Team"
            }
            console.log("=====ERROR===\\\\\\\\\\\\\\\\\\\\")
            smtpTransport.sendMail(mail, function (error, response) {
                console.log("=====ERROR===",error,response)
                if (error) {
                    callback(0);
                } else {
                    callback(1);
                }
                smtpTransport.close();
            });
        });
    },
};

function if_vf_exists(last_insertid, callback) {
    var code = randomize('Aa09');
    User.findOne({
        'email_verification_code': code
    }, function (err, result) {
        if (err) { console.log("error - ", err); }
        else {
            if (result) {
                code = randomize('Aa09');
            }
            var check = { '_id': last_insertid };
            var data = { 'email_verification_code': code };
            User.findOneAndUpdate(check, data, function (uperr, upresp) {
                if (uperr) {
                    console.log("error in updating verification code");
                } else {
                    callback(code);
                }
            });
        }
    });
}
function if_email_exists(obj, callback) {
    console.log("===obj==", obj)
    var code = randomize('Aa09', 10);
    // var check = { 'email_id': email };
    // var data = { is_email_verified: '1', email_verification_code: 0 };
    // user.findOneAndUpdate(check, data, function (uperr, upresp) {
    User.findOne({
        'email_verification_code': code
    }, function (error, result) {
        // connection.query("select email_id from users where email_verification_code='" + code + "'", function (error, result) {
        if (error) {
            console.log("error-", error)
        }
        else {
            if (result) {
                code = randomize('Aa09', 10);
            }
            var new_password = crypto.createHash('md5').update(code).digest('hex')
            var check = { 'email_id': obj.email_id };
            var data = { password: new_password };
            User.findOneAndUpdate(check, data, function (uperr, upresp) {

                if (uperr) {
                    console.log("error in updating verification code");
                } else {
                    console.log("updated", code, obj.email_id)
                    callback(code);
                }
            })
        }
    })
}
