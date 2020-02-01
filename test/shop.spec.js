process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../database/models/user');
const Shop = require('../database/models/shop');
const should = chai.should();
const expect = chai.expect;

describe('# When request shop', () => {
  context('# When request to endpoint /shops', () => {
    describe('When user request to get shops data', () => {
      let token;
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
        await new Shop({
          shopName: 'testshop',
          shopAddress: 'testshopAddress',
          shopTel: '02-8888-8888',
          representative: 'testshop'
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

      it('should return 200 when user request with token', done => {
        request(app)
          .get('/api/v1/shops')
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(typeof res.body.shops).to.eq('object');
            expect(res.body.shops.length).greaterThan(0);
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
        await Shop.findOneAndDelete({ shopName: 'testshop' });
      });
    });
  });

  context('# When request to endpoint /shops/create', () => {
    describe('When admin request to create shops data', () => {
      let token;
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
        await new Shop({
          shopName: 'testshop',
          shopAddress: 'testshopAddress',
          shopTel: '02-8888-8888',
          representative: 'testshop'
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

      it('should return 400 when request information is not enough is not enough', done => {
        request(app)
          .post('/api/v1/shops/create')
          .set('Authorization', 'bearer ' + token)
          .send({})
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq("required fields didn't exist");
            done();
          });
      });

      it('should return 400 when shop is already existed', done => {
        request(app)
          .post('/api/v1/shops/create')
          .set('Authorization', 'bearer ' + token)
          .send({
            shopName: 'testshop',
            shopAddress: 'testshopAddress',
            shopTel: '02-8888-8888',
            representative: 'testshop'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq('Shop already exist');
            done();
          });
      });

      it('should return 200 when shop create success', done => {
        request(app)
          .post('/api/v1/shops/create')
          .set('Authorization', 'bearer ' + token)
          .send({
            shopName: 'testshop2',
            shopAddress: 'testshopAddress',
            shopTel: '02-8888-8888',
            representative: 'testshop'
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('Create Shop Success');
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
        await Shop.findOneAndDelete({ shopName: 'testshop' });
        await Shop.findOneAndDelete({ shopName: 'testshop2' });
      });
    });
  });

  context('# When request to endpoint /shops/edit/:shopId', () => {
    describe('When admin request to change shop data', () => {
      let token, lastShop;
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
        await new Shop({
          shopName: 'testshop',
          shopAddress: 'testshopAddress',
          shopTel: '02-8888-8888',
          representative: 'testshop'
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

      it('should return 200 when user request with token', done => {
        request(app)
          .get('/api/v1/shops')
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            lastShop = res.body.shops.pop();
            done();
          });
      });

      it('should return 400 when shop is already existed', done => {
        request(app)
          .put(`/api/v1/shops/edit/${lastShop._id}`)
          .set('Authorization', 'bearer ' + token)
          .send({
            shopName: 'testshop',
            shopAddress: 'testshopAddress',
            shopTel: '02-8888-8888',
            representative: 'testshop'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            expect(res.body.message).to.eq('Shop already exist');
            done();
          });
      });

      it('should return 400 when shop is already existed', done => {
        request(app)
          .put(`/api/v1/shops/edit/${lastShop._id}`)
          .set('Authorization', 'bearer ' + token)
          .send({
            shopName: 'testshop2',
            shopAddress: 'testshopAddress',
            shopTel: '02-8888-8888',
            representative: 'testshop'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('Update Shop Info Success');
            done();
          });
      });

      it('should return 400 when malware request', done => {
        request(app)
          .put(`/api/v1/shops/edit/321k28sdasd823kl`)
          .set('Authorization', 'bearer ' + token)
          .send({
            shopName: 'testshop3',
            shopAddress: 'testshopAddress',
            shopTel: '02-8888-8888',
            representative: 'testshop'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
        await Shop.findOneAndDelete({ shopName: 'testshop2' });
      });
    });
  });

  context('# When request to endpoint /shops/delete/:shopId', () => {
    describe('When admin request to delete shop data', () => {
      let token, lastShop;
      before(async () => {
        await new User({
          name: 'test',
          email: 'test@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: true
        }).save();
        await new Shop({
          shopName: 'testshop',
          shopAddress: 'testshopAddress',
          shopTel: '02-8888-8888',
          representative: 'testshop'
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

      it('should return 200 when user request with token', done => {
        request(app)
          .get('/api/v1/shops')
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            lastShop = res.body.shops.pop();
            done();
          });
      });

      it('should return 200 and delete shop info', done => {
        request(app)
          .delete(`/api/v1/shops/delete/${lastShop._id}`)
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.eq('success');
            expect(res.body.message).to.eq('Delete Shop Info Success');
            done();
          });
      });

      it('should return 400 when malware request', done => {
        request(app)
          .delete(`/api/v1/shops/delete/312jk21j3kksdf8323`)
          .set('Authorization', 'bearer ' + token)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.eq('error');
            done();
          });
      });

      after(async () => {
        await User.findOneAndDelete({ name: 'test' });
      });
    });
  });
});
