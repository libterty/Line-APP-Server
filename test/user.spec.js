process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../index');
const helpers = require('../_helper');
const should = chai.should();
const expect = chai.expect;

const mochaAsync = fn => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

describe('# When User request', () => {
  context('# When User request for login', () => {
    describe('When request hit endpoint /auth/line', () => {
      it('should redirect to line login page', done => {
        request(app)
          .get('/api/v1/auth/line')
          .expect(302)
          .end((err, res) => {
            expect(res.header.location).include('access.line.me/oauth2/v2.1');
            done();
          });
      });
    });

    describe('When request hit endpoint /auth/line/callback', () => {
      before(async () => {
        this.getUser = sinon
          .stub(helpers, 'getUser')
          .returns({ id: 1, name: 'test1', isAdmin: false });
      });

      it('should return back to /auth/line', done => {
        request(app)
          .get('/api/v1/auth/line')
          .expect(302)
          .end((err, res) => {
            console.log('res', res);
            done();
          });
      });

      after(async () => {
        this.getUser.restore();
      });
    });
  });
});
