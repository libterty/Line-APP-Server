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
            // console.log('res', res);
            done();
          });
      });

      after(async () => {
        this.getUser.restore();
      });
    });
  });
});

describe('# When Admin Request', () => {
  context('# When Admin request for login', () => {
    describe('When Request hit the endpoint /admin/signin', () => {
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
      });

      it('Should return 400 when user request info is insufficient and not able to signin', done => {
        request(app)
          .post('/api/v1/admin/signin')
          .send({ password: '123' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq("required fields didn't exist");
            done();
          });
      });

      it('Should return 401 when user is not exist and not able to signin', done => {
        request(app)
          .post('/api/v1/admin/signin')
          .send({ email: 'test', password: 'test@example.com' })
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq(
              'no such user found or passwords did not match'
            );
            done();
          });
      });

      it('Should return 401 when password is incorrect and not able to signin', done => {
        request(app)
          .post('/api/v1/admin/signin')
          .send({ email: 'test@example.com', password: '123123123' })
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq(
              'no such user found or passwords did not match'
            );
            done();
          });
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
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
      });
    });
  });
});
