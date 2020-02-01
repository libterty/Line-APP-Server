process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../database/models/user');
const helpers = require('../_helper');
const should = chai.should();
const expect = chai.expect;

describe('# When User Request', () => {
  context('# When User Request admin end point', () => {
    describe('When request hit endpoint includes /admin', () => {
      let token, userToken;
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
        await new User({
          name: 'user',
          email: 'user@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: false
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

      it('Should return 200 when info is correct and able to signin', done => {
        request(app)
          .post('/api/v1/admin/signin')
          .send({ email: 'user@example.com', password: '12345678' })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('Welcome Back Admin');
            userToken = res.body.token;
            done();
          });
      });

      it('should return 401 when user request with fake token', done => {
        request(app)
          .get('/api/v1/admin/test')
          .set('Authorization', 'bearer ' + userToken)
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq('permission denied');
            done();
          });
      });

      it('should return 200 when user request with admin token', done => {
        request(app)
          .get('/api/v1/admin/test')
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('admin authenticated test');
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
        await User.findOneAndDelete({ name: 'user' });
      });
    });
  });
});
