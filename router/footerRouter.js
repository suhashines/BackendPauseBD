const express = require('express')

const footerRouter = express.Router();

const {
    editFooter,
    getFooter
} = require('../controller/footerController');

footerRouter.route('/')
.get(getFooter)
.patch(editFooter);

module.exports = footerRouter;