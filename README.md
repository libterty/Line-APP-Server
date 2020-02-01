# Line App Server

- Simple Line App API Server which allows you to login with Line oauth2 login api, after granting token you can access protected routes
- [DEMO](https://lineappserver.herokuapp.com/api/v1)

[![Build Status](https://travis-ci.org/libterty/Line-APP-Server.svg?branch=master)](https://travis-ci.org/libterty/Line-APP-Server)
[![Coverage Status](https://coveralls.io/repos/github/libterty/Line-APP-Server/badge.svg?branch=master)](https://coveralls.io/github/libterty/Line-APP-Server?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/libterty/Line-APP-Server/blob/master/LICENCE)

# CopyRight
Copyright © 2020, 11. Released under the MIT License.

## Feature

- Allow User to sigin with Line Login
- Grant access for User to view shops information
- Protect shop routes with JOSN WEB TOKEN
- Grant access for Adminstrator to login to admin routes
- Grant access for Adminstrator to create & edit & delete shops

## Environment Setup

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com)
- [Redis](https://redis.io)

## Environment Variable Setup

```bash
JWT_SECRET=
channelID= // line app ID
channelSecret= // line app secert
callbackURL= // line app callback url
MONGODB_URI= // NOSQL MONGODB url
REDIS_URL= // REDIS url
```

# Installing Process

## Cloning Project

```
$ git clone https://github.com/libterty/Line-APP-Server.git
```

## Install npm package

```
$ npm install
```

### Init DataBase


- MongoDB
```
$ mongo

$ mongod
```

- Redis
```
$ redis-server
```

### Install Seeds Data

```
$ npm run seeds
```

### Running Program

```
$ npm start
```

### Linting

```
$ npm run lint
```

### Running test locally

```
$ npm test
```

# Author
- [11](https://github.com/libterty)