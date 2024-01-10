const express = require('express');

const orderRouter = express.Router();

const {calculateOrder,
confirmOrder,
addDeliveryCharge,
editDeliveryCharge,
getDeliveryCharge
} = require('../controller/orderController');

orderRouter.route('/calculate')
.post(calculateOrder);

orderRouter.route('/confirm')
.post(confirmOrder);

orderRouter.route('/delivery')
.get(getDeliveryCharge)
.patch(editDeliveryCharge);



module.exports = orderRouter; 