'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const controller = require('../controller/userController');
var jwt = require('jsonwebtoken');
var config = require('../config/config');


exports.register = function (server, options, next) {

    const db = server.app.db;



    server.route({
        path: '/users',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.ADD_USER(req, res)
            },
            description: 'Register a new User',
            notes: 'Register the user with unique email id',
            tags: ['api'],
            validate: {
                payload: {
                    name: Joi.string()
                        .required(),
                    email_id: Joi.string().email()
                        .required(),
                    password: Joi.string()
                        .required(),
                    role: Joi.string()
                        .required(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',

                }
            }
        }
    });


    server.route({
        path: '/users',
        method: 'get',
        config: {
            handler: (req, res) => {
                controller.GET_USER(req, res)
            },
            description: 'Get the list of all users',
            notes: 'Get the list of users',
            tags: ['api'],
        }
    });


    server.route({
        path: '/users',
        method: 'PUT',
        config: {
            handler: (req, res) => {
                controller.UPDATE_USER(req, res)
            },
            description: 'Update the user',
            notes: 'Update the user on the basis of id',
            tags: ['api'],
            validate: {
                payload: {
                    user_id: Joi.string()
                        .required(),
                    name: Joi.string()
                        .optional(),
                    email_id: Joi.string().email()
                        .optional(),
                    password: Joi.string()
                        .optional(),
                    role: Joi.string()
                        .optional(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    });


    server.route({
        path: '/users',
        method: 'DELETE',
        config: {
            handler: (req, res) => {
                controller.DELETE_USER(req, res)
            },
            description: 'Delete the user',
            notes: 'Delete the user',
            tags: ['api'],
            validate: {
                payload: {
                    user_id: Joi.string()
                        .required(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    });


    server.route({
        path: '/users/signin',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.SIGN_IN(req, res)
            },
            description: 'login the user',
            notes: 'login the user',
            tags: ['api'],
            validate: {
                payload: {
                    email_id: Joi.string().email()
                        .required(),
                    password: Joi.string()
                        .required(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    });


    server.route({
        path: '/update',
        method: 'PUT',
        config: {
            handler: (req, res) => {
                controller.UPDATE_USERSS(req, res)
            },
            // pre: [{
            //     assign: 'tokenCheck',
            //     method: function (req, res) {
            //         console.log("req", req.headers.authorization)
            //         var token = req.headers.authorization;
            //         var secret = config.secret
            //         //jwt.verify(token, secret.toString(), function (err, decoded) {
            //         jwt.verify(token, 'secret', function (err, decoded) {
            //             console.log("====ERROR======",err,decoded)
            //             if (err) {
            //                 return res(err)
            //             } else {
            //                 res(true)
            //             }
            //             });

            //     }
            // }],
            description: 'Update the user',
            notes: 'Update the user on the basis of id',
            tags: ['api'],
            validate: {
                payload: {
                    user_id: Joi.string()
                        .required(),
                    name: Joi.string()
                        .optional(),
                    email_id: Joi.string().email()
                        .optional(),
                    password: Joi.string()
                        .optional(),
                    role: Joi.string()
                        .optional(),

                    //     headers:
                    //        Joi.object({
                    //     authorization:
                    //     Joi.string().required().description('Bearer accessToken')
                    //      }).unknown(),
                },
                headers: Joi.object({
                    authorization: Joi.string().required().description(' accessToken')
                }).unknown()

            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    });


    server.route({
        path: '/users/login',
        method: 'GET',
        config: {
            handler: (req, res) => {
                console.log("users/login")
                controller.LOGIN(req, res)
            },
            description: 'For front end only',
            notes: 'LOGIN the user on the basis of id',
            tags: ['api'],

            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    });


    server.route({
        path: '/users/forgot_password',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.FORGOT_PASSWORD(req, res)
            },
            description: 'forgot password',
            notes: 'sends the password to the email',
            tags: ['api'],
            validate: {
                payload: {
                    email_id: Joi.string().email()
                        .required(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',

                }
            }
        }
    });


    server.route({
        path: '/users/change_password',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.CHANGE_PASSWORD(req, res)
            },
            description: 'change password',
            notes: 'change the password of the user',
            tags: ['api'],
            validate: {
                payload: {
                    email_id: Joi.string()
                        .required(),
                    password: Joi.string()
                        .required(),
                    new_password: Joi.string()
                        .required(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',

                }
            }
        }
    });

    server.route({
        path: '/users/user_detail',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.USER_DETAIL(req, res)
            },
            description: 'get the detail of the user',
            notes: 'git the detail of the user',
            tags: ['api'],
            validate: {
                payload: {
                    user_id: Joi.string()
                        .required(),
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-users'
};
