'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

  

    server.route({
        path: '/api/get',
        method: 'POST',
        config: {
            handler: (request, reply) => {
                var sum = parseInt(request.payload.a) + parseInt(request.payload.b);
                reply(sum);
            },
            description: 'Get algebraic sum',
            notes: 'Pass two numbers as a & b and returns sum',
            tags: ['api'],
            validate: {
                payload: {
                    a : Joi.number()
                            .required(),
                    b : Joi.number()
                            .required(),
                }
            }
        }
    });

    server.route({
        path: '/api/post',
        method: 'POST',
        config: {
            handler: (request, reply) => {
                var sum = parseInt(request.payload.a) + parseInt(request.payload.b);
                reply(sum);
            },
            description: 'Get algebraic sum',
            notes: 'Pass two numbers as a & b and returns sum',
            tags: ['api'],
            validate: {
                payload: {
                    a : Joi.number()
                            .required(),
                    b : Joi.number()
                            .required(),
                }
            }
        }
    });
  

    

   
  
    return next();
};

exports.register.attributes = {
    name: 'routes-books'
};
