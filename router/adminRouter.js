const express = require("express");

const adminRouter = express.Router();

const {
  signup,
  login,
  editAccount,
  confirmOrder,
  getPendingOrders,
  addProduct,
  editProduct,
  deleteProduct,
  getProductWiseIncome,
  selectColor,
  getPendingOrderById
} = require("../controller/adminController");

adminRouter.route("/signup").post(signup);

adminRouter.route("/login").post(login);

adminRouter.route("/edit/:id").patch(editAccount);

adminRouter.route("/order/pending").get(getPendingOrders);

adminRouter.route("/order/pending/:id").get(getPendingOrderById);

adminRouter.route("/order/confirm/:id").patch(confirmOrder);

adminRouter.route('/product')
.post(addProduct)

adminRouter.route('/product/:id')
.patch(editProduct)
.delete(deleteProduct)

adminRouter.route('/income/product')
.get(getProductWiseIncome);

adminRouter.route('/color')
.get(selectColor);

module.exports = adminRouter;
