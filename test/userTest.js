//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let users = require('../schema/users');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let user_id;
let userf = {
    name: "user" + Date.now(),
    email_id: "hkcus" + Date.now() + "@yopmail.com",
    password: "user"
}
let userp = {
    name: "user" + Date.now(),
    email_id: "hkcus" + Date.now() + "@yopmail.com",
    password: "user",
    role: "user"
}
chai.use(chaiHttp);



//Our parent block
describe('users', () => {
    beforeEach((done) => { //Before each test we empty the database
        users.remove({}, (err) => {
            done();
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request('http://localhost:3001')
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.a('array');
                    res.body.msg.length.should.be.eql(0);
                    done();
                });
        });
    });
});
/*
 * Test the /POST route
 */
describe('/POST user', () => {
    it('it should not POST a user', (done) => {
        chai.request('http://localhost:3001')
            .post('/users')
            .send(userf)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    it('it should POST a book ', (done) => {
        chai.request('http://localhost:3001')
            .post('/users')
            .send(userp)
            .end((err, res) => {
                user_id = res.body.data._id
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eql('inserted');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('email_id');
                res.body.data.should.have.property('role');
                users.findOneAndUpdate({ _id: res.body.data._id }, { email_verification_code: "0", is_email_verified: 1 }, { new: true }).exec(function (error, result) {
                    done();
                })
            });
    });
});


/*
* Test the /POST route
*/
describe('/SIGNIN ', () => {
    it('it should not login', (done) => {
        chai.request('http://localhost:3001')
            .post('/users/signin')
            .send(userf)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    it('it should login', (done) => {
        chai.request('http://localhost:3001')
            .post('/users/signin')
            .send({ email_id: userp.email_id, password: userp.password })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('email_id');
                res.body.data.should.have.property('role');
                res.body.should.have.property('token');
                done();

            });
    });
});


/*
* Test the  change password
*/
describe('/change password ', () => {
    it('it should not change password', (done) => {
        chai.request('http://localhost:3001')
            .post('/users/change_password')
            .send({ email_id: userf.email_id, password: "USER", new_password: "userp" })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should change password', (done) => {
        chai.request('http://localhost:3001')
            .post('/users/change_password')
            .send({ email_id: userp.email_id, password: userp.password, new_password: "userp" })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('msg').eql('Password changed successfully!');
                done();

            });
    });
});


/*
* Test the  update profile
*/
describe('/update profile ', () => {
    it('it should not update profile', (done) => {
        chai.request('http://localhost:3001')
            .put('/users')
            .send({ user_id: "59e4555c5b9d403c5e97981d" })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should update profile', (done) => {
        chai.request('http://localhost:3001')
            .put('/users')
            .send({ user_id: user_id, name: "updateduser" + Date.now() })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('msg').eql('updated');
                res.body.data.should.be.a('object');
                done();

            });
    });
});


/*
* Test the get details
*/
describe('/ profile ', () => {
    // it('it should not get the profile', (done) => {
    //     chai.request('http://localhost:3001')
    //         .post('/users/user_detail')
    //         .send({ user_id: "59e4555c5b9d403c5e9"})
    //         .end((err, res) => {
    //             res.should.have.status(500);
    //             done();
    //         });
    // });
    it('it should get the profile profile', (done) => {
        chai.request('http://localhost:3001')
            .post('/users/user_detail')
            .send({ user_id: user_id })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.be.a('array');
                done();
            });
    });
});


/*
* Test the delete
*/
describe('/delete profile ', () => {
    it('it should not delete profile', (done) => {
        chai.request('http://localhost:3001')
            .delete('/users')
            .send({ user_id: "59e4555c5b9d403c5e9" })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should delete profile', (done) => {
        chai.request('http://localhost:3001')
            .delete('/users')
            .send({ user_id: user_id })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('msg').eql('deleted');
                done();
            });
    });
});
