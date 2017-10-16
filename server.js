
const Hapi = require('hapi');
const mongojs = require('mongojs');
const Inert = require('inert');
const Vision = require('vision');
var Handlebars = require('handlebars')
const Joi = require('joi');
var mongoose    = require('mongoose'); 
var config = require('./config/config');
const HapiSwagger = require('hapi-swagger');
const server = new Hapi.Server();
mongoose.connect(config.database); // connect to database
// mongoURI = 'mongodb://hapi:hapi@ds117625.mlab.com:17625/hapi';
// mongoose.connect(process.env.MONGOLAB_URI || mongoURI,{ useMongoClient: true });
// console.log(mongoURI)

server.connection({
   host: 'localhost' ,
  routes: { cors: true },
    port: process.env.PORT||3001
});
const options = {
    info: {
        'title': 'Test API Documentation',
        'version': '0.0.1',
    }
};
server.register([
    //require('./routes/books'),
    require('./routes/users'),
    require('./routes/questions'),
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options,
        
    }], (err) => {
        server.views({
            engines: {
              ejs: require('ejs')
            },
            path: __dirname + '/views',
            //layout: 'layout'
          })

          
        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
                
            }
            
        });
});
module.exports = server