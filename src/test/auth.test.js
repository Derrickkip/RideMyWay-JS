/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../index');

chai.use(chaiHttp);
chai.should();

const user = {
  email: 'testuser@gmail.com',
  username: 'TestUser',
  phonenumber: '01234367890',
  password: 'B7n@ande',
};

describe('/signup', () => {
  it('should login user with correct details', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  // it('should return correct message', (done) => {
  //   chai.request(app)
  //     .get('/')
  //     .end((err, response) => {
  //       response.text.should.contain('Hello World');
  //       done();
  //     });
  // });
});

// const assert = require('assert');

// // eslint-disable-next-line no-undef
// describe('Array', () => {
//   describe('#indexOf()', () => {
//     it('should return -1 when the value is not present', () => {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });