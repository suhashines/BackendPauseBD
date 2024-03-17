const Collections = require("../database/collections");
const Products = require("../database/products");

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;

  if (longerLength === 0) {
    return 1.0;
  }

  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}


function searchUtil(array, name) {
  const matched = array.map((object) => ({
    object,
    similarity: calculateSimilarity(name, object.name),
  }));

  const sorted = matched.sort((a, b) => b.similarity - a.similarity);
  return sorted;
}

async function search(req, res) {

  try {
    const {name} = req.body ;

    console.log("got name "+name);
    // Find all collections
    const allCollections = await Collections.find();

    // Calculate similarity scores for each collection name
    const matchedCollections = searchUtil(allCollections, name);
    res.json({ collections: matchedCollections });
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
}

async function getBestCollection(req, res) {
  const collections = await Collections.find();
  collections.sort((a, b) => b.order - a.order);
  res.json(collections[0]);
}

async function getAllCollection(req, res) {
  const collections = await Collections.find();
  collections.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ collections });
}

async function getLatestCollection(req, res) {
  const collections = await Collections.find();
  collections.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(collections[0]);
}

async function editCollection(req, res) {
  const collectionId = req.query.id;

  const updatedCollection = await Collections.findByIdAndUpdate(
    { _id: collectionId },
    { $set: req.body },
    { new: true }
  );

  return res.json({ updatedCollection: updatedCollection });
}

async function deleteCollection(req, res) {
  const collectionId = req.query.id;

  await Products.deleteMany({ collection: collectionId });

  const removedCollection = await Collections.findByIdAndDelete({
    _id: collectionId,
  });

  return res.json({ removedCollection: removedCollection });
}

async function addCollection(req, res) {
  const { name, portrait, landscape } = req.body;

  //first checking if this collection already exists

  const collection = await Collections.find({ name: name });

  // console.log(collection);

  if (collection.length != 0) {
    return res.json({ success: false, message: "Collection already exists" });
  }

  const newCollection = new Collections({
    name,
    portrait,
    landscape,
  });

  const savedCollection = await newCollection.save();

  return res.json({ collection: savedCollection, success: true });
}

async function setFeaturedCollection(req, res) { 
  const collectionId = req.params.id;

  await Collections.updateMany({}, { $set: { isFeatured: false } });

  console.log("got id ", collectionId, " to set feature");

  const updatedCollection = await Collections.findByIdAndUpdate(
    { _id: collectionId },
    { $set: { isFeatured: true } },
    { new: true }
  );

  return res.json({ collection: updatedCollection, success: true });
}

async function getFeaturedCollection(req, res) {
  const featured = await Collections.find({ isFeatured: true });

  console.log("got featured collection ", featured);

  return res.json({ collection: featured[0] });
}


async function getCollectionById(req,res){
    const collectionId = req.params.id ;

    try{
      const collection = await Collections.findById(collectionId);
      return res.json({collection});
    }catch(e){
      return res.json({error:e.message});
    }
}

module.exports = {
  getAllCollection,
  addCollection,
  editCollection,
  deleteCollection,
  setFeaturedCollection,
  getFeaturedCollection,
  getLatestCollection,
  getBestCollection,
  search,
  searchUtil,
  getCollectionById
};
