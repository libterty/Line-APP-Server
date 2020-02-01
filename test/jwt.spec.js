process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const app = require('../index');
const helpers = require('../_helper');
const User = require('../database/models/user');
const should = chai.should();
const expect = chai.expect;

describe('# When User request', () => {
  context('# When User request for protected routes', () => {
    describe('When request hit endpoint /test', () => {
      let token;
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
      });

      it('Should return 200 when info is correct and able to signin', done => {
        request(app)
          .post('/api/v1/admin/signin')
          .send({ email: 'test@example.com', password: '12345678' })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('Welcome Back Admin');
            token = res.body.token;
            done();
          });
      });

      it('should return 401 when user request without token', done => {
        request(app)
          .get('/api/v1/test')
          .set('Authorization', 'bearer ' + '')
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            expect(res.text).to.eq('Unauthorized');
            done();
          });
      });

      it('should return 200 when user request with token', done => {
        request(app)
          .get('/api/v1/test')
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('authenticated test');
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
      });
    });
  });
});
