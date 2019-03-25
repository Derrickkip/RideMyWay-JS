// const chai = require('chai');
// const chaiHttp = require('chai-http');

// const app = require('../../index');

// chai.use(chaiHttp);

// describe('The / route', () => {
//   it('should return Ok status', (done) => {
//     chai.request(app)
//       .get('/')
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });

//   it('should return correct message', (done) => {
//     chai.request(app)
//       .get('/')
//       .end((err, response) => {
//         response.text.should.contain('Hello World');
//         done();
//       });
//   });
// });
