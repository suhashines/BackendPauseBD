const express = require('express');

const headerRouter = express.Router();

const {setHeaders,getHeaders,editHeaders} = require('../controller/headerController')


headerRouter.route('/')
.get(getHeaders)
.post(setHeaders)
.patch(editHeaders)

module.exports = headerRouter;