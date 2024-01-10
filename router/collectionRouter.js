const express = require("express");

const collectionRouter = express.Router();
const {
  getAllCollection,
  addCollection,
  editCollection,
  deleteCollection,
  setFeaturedCollection,
  getFeaturedCollection,
  getLatestCollection,
  getBestCollection,
  search,
  getCollectionById
} = require("../controller/collectionController");

collectionRouter.route("/")
.get(getAllCollection)
.post(addCollection)
.patch(editCollection)
.delete(deleteCollection);

collectionRouter.route('/details/:id')
.get(getCollectionById);

collectionRouter.route("/featured/:id")
.patch(setFeaturedCollection)

collectionRouter.route("/featured")
.get(getFeaturedCollection)

collectionRouter.route("/latest")
.get(getLatestCollection);

collectionRouter.route("/best")
.get(getBestCollection);

collectionRouter.route("/search")
.get(search);

module.exports = collectionRouter;
