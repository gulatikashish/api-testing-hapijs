'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const controller = require('../controller/questionController');


exports.register = function (server, options, next) {

    const db = server.app.db;



    server.route({
        path: '/questions',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.ADD_QUESTION(req, res)

            },
            description: 'Register a new Question',
            notes: 'Register the new question on the basis of userid',
            tags: ['api'],
            validate: {
                payload: {
                    user_id: Joi.string()
                        .required(),
                    question_name: Joi.string()
                        .required(),
                    question_type: Joi.string()
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
        path: '/questions',
        method: 'get',
        config: {
            handler: (req, res) => {
                controller.GET_QUESTION(req, res)
            },
            description: 'Get the list of all Questions',
            notes: 'Get the list of questions',
            tags: ['api'],
        }
    });
    server.route({
        path: '/questions/getall',
        method: 'post',
        config: {
            handler: (req, res) => {
                controller.GET_ALL_QUESTION(req, res)
            },
            description: 'Get the list of all Questions',
            notes: 'Get the list of questions',
            tags: ['api'],
            validate: {
                payload: {
                    page: Joi.number()
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
        path: '/questions',
        method: 'PUT',
        config: {
            handler: (req, res) => {
                controller.UPDATE_QUESTION(req, res)

            },
            description: 'Update the user',
            notes: 'Update the user on the basis of id',
            tags: ['api'],
            validate: {
                payload: {
                    question_id: Joi.string()
                        .required(),
                    name: Joi.string()
                        .optional(),
                    type: Joi.string()
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
        path: '/questions',
        method: 'DELETE',
        config: {
            handler: (req, res) => {
                controller.DELETE_QUESTION(req, res)

            },
            description: 'Delete the question',
            notes: 'Delete the question',
            tags: ['api'],
            validate: {
                payload: {
                    question_id: Joi.string()
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
        path: '/questions/question_detail',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.QUESTION_DETAIL(req, res)

            },
            description: 'get the detail of the question',
            notes: 'get the detail of the question',
            tags: ['api'],
            validate: {
                payload: {
                    question_id: Joi.string()
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
        path: '/questions/type_based_question',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.TYPE_DETAIL(req, res)

            },
            description: 'get the question list on the basis of the type',
            notes: 'get the question list on the basis of the type',
            tags: ['api'],
            validate: {
                payload: {
                    question_type: Joi.string()
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
        path: '/questions/like',
        method: 'POST',
        config: {
            handler: (req, res) => {
                controller.LIKE_QUESTION(req, res)

            },
            description: 'like the questions',
            notes: 'like the questions',
            tags: ['api'],
            validate: {
                payload: {
                    question_id: Joi.string()
                        .required(),
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
    name: 'routes-questions'
};
