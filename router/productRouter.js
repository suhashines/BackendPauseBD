const express = require("express");

const productRouter = express.Router(); 

const {
  getProductByCollection,
  getProductByColor,
  getAllColors,
  getColorByCollection,
  filters,
  filtersbyCategory,
  filtersbyCollection,
  getProductById,
  getAllProducts,
  getProductByCategory,
  getAllCategories,
  search,
  getColorByCategory 
} = require("../controller/productController");

productRouter
  .route("/")
  .get(getProductById);

productRouter.route("/all").get(getAllProducts);

productRouter.route("/collection").get(getProductByCollection);

productRouter.route("/color").get(getProductByColor);

productRouter.route("/color/:id").get(getColorByCollection);

productRouter.route('/colorcategory/:id').get(getColorByCategory);

productRouter.route("/all/color").get(getAllColors); 

productRouter.route("/filter").post(filters);

productRouter.route('/filter/collection/:id').post(filtersbyCollection);

productRouter.route('/filter/category/:id').post(filtersbyCategory);

productRouter.route("/category/:id").get(getProductByCategory);

productRouter.route('/category').get(getAllCategories);

productRouter.route('/search')
.get(search);

module.exports = productRouter;
