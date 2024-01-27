const Products = require("../database/products");
const Categories = require("../database/categories");
const { searchUtil } = require("./collectionController");

async function getAllCategories(req, res) {
  const categories = await Categories.find();

  return res.json({ categories });
}

async function getProductByCategory(req, res) {
  const categoryId = req.params.id;

  const products = await Products.find({ category: categoryId });

  return res.json({ products });
}

async function getAllProducts(req, res) {
  const products = await Products.find();
  products.sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ products });
}

async function getProductById(req, res) {
  const productId = req.query.id;

  const product = await Products.findById({ _id: productId });

  return res.json({ product: product });
}

async function getProductByCollection(req, res) {
  const collectionId = req.query.id;
  console.log("You insied getProductByCollection")
  console.log("got id: " + collectionId);

  const products = await Products.find({ collection: collectionId });

  console.log("recieved ", products);
  products.sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ products: products });
}

async function getProductByColor(req, res) {
  const { id, color } = req.query;

  let product = await Products.findOne({ _id: id });

  let images = await product.colors.find((c) => c.name === color);

  return res.json({ front: images.frontImage, back: images.backImage });
}

async function getAllColors(req, res) {
  try {
    // Use the distinct method with await to find all unique color names
    const uniqueColors = await Products.distinct("colors.name");

    console.log("Unique Color Names:", uniqueColors);

    return res.json({ colors: uniqueColors });
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getColorByCollection(req, res) {
  const collectionId = req.params.id;

  console.log("got my collection id ", collectionId);
  try {
    const colors = await Products.distinct("colors.name", {
      collection: collectionId,
    });

    return res.json({ colors });
  } catch (err) {
    console.log(err);
  }
}

async function getColorByCategory(req, res) {
  const categoryId = req.params.id;

  console.log("got my category id ", categoryId);
  try {
    const colors = await Products.distinct("colors.name", {
      category: categoryId,
    });

    return res.json({ colors });
  } catch (err) {
    console.log(err);
  }
}

async function getProductsBySizes(sizesToFind) {
  try {
    // Use the find method with await to find all products with any of the specified sizes
    const products = await Products.find({
      "colors.sizes": { $elemMatch: { size: { $in: sizesToFind } } },
    });
    console.log(`Products with Sizes ${sizesToFind.join(", ")}:`, products);
    return products;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getProductsByColors(colors) {
  try {
    const products = await Products.find({ "colors.name": { $in: colors } });

    return products;
  } catch (err) {
    console.log(err);
  }
}

async function getProductByColorsAndSizes(colors, sizes) {
  console.log(colors, " ", sizes);

  try {
    const products = await Products.find({
      "colors.name": { $in: colors },
      "colors.sizes": { $elemMatch: { size: { $in: sizes } } },
    });
    return products;
  } catch (err) {
    console.log(err);
  }
}

async function filters(req, res) {
  const { sizes, colors, sort } = req.body;

  let products;

  if (colors.length == 0 && sizes.length != 0) {
    console.log("filtering for sizes ", sizes);
    products = await getProductsBySizes(sizes);
  } else if (colors.length != 0 && sizes.length == 0) {
    console.log("filtering for colors ", colors);
    products = await getProductsByColors(colors);
  } else if (colors.length != 0 && sizes.length != 0) {
    console.log("filtering for both colors and sizes");

    products = await getProductByColorsAndSizes(colors, sizes);
  } else {
    console.log("no filter has been applied");
    products = await Products.find();
  }

  if (sort === "date") {
    products.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === "alphabet") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "best") {
    products.sort((a, b) => b.order - a.order);
    console.log("sorting by orders");
  }

  return res.json({ products });
}

// the same logic will be applied in collection and category

async function getCollectionBySizes(sizesToFind, collectionId) {
  try {
    // Use the find method with await to find all products with any of the specified sizes
    const products = await Products.find({
      "colors.sizes": { $elemMatch: { size: { $in: sizesToFind } } },
      collection: collectionId,
    });
    console.log(`Products with Sizes ${sizesToFind.join(", ")}:`, products);
    return products;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getCollectionByColors(colors, collectionId) {
  try {
    const products = await Products.find({
      "colors.name": { $in: colors },
      collection: collectionId,
    });

    return products;
  } catch (err) {
    console.log(err);
  }
}

async function getCollectionByColorsAndSizes(colors, sizes,collectionId) {
  console.log(colors, " ", sizes);

  try {
    const products = await Products.find({
      "colors.name": { $in: colors },
      "colors.sizes": { $elemMatch: { size: { $in: sizes } } },
       collection:collectionId
    });
    return products;
  } catch (err) {
    console.log(err);
  }
}

async function filtersbyCollection(req, res) {
  const { sizes, colors, sort} = req.body;
  const collectionId = req.params.id;

  let products;

  if (colors.length == 0 && sizes.length != 0) {
    console.log("filtering for sizes ", sizes);
    products = await getCollectionBySizes(sizes, collectionId);
  } else if (colors.length != 0 && sizes.length == 0) {
    console.log("filtering for colors ", colors);
    products = await getCollectionByColors(colors, collectionId);
  } else if (colors.length != 0 && sizes.length != 0) {
    console.log("filtering for both colors and sizes");

    products = await getCollectionByColorsAndSizes(colors, sizes,collectionId);
  } else {
    console.log("no filter has been applied");
    products = await Products.find({ collection: collectionId });
  }

  if (sort === "date") {
    products.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === "alphabet") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "best") {
    products.sort((a, b) => b.order - a.order);
    console.log("sorting by orders");
  }

  return res.json({ products });
}


// applying the same logic for category


async function getCategoryBySizes(sizesToFind, categoryId) {
  try {
    // Use the find method with await to find all products with any of the specified sizes
    const products = await Products.find({
      "colors.sizes": { $elemMatch: { size: { $in: sizesToFind } } },
      category: categoryId,
    });
    console.log(`Products with Sizes ${sizesToFind.join(", ")}:`, products);
    return products;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getCategoryByColors(colors, categoryId) {
  try {
    const products = await Products.find({
      "colors.name": { $in: colors },
      category: categoryId
    });

    return products;
  } catch (err) {
    console.log(err);
  }
}

async function getCategoryByColorsAndSizes(colors, sizes,categoryId) {
  console.log(colors, " ", sizes);

  try {
    const products = await Products.find({
      "colors.name": { $in: colors },
      "colors.sizes": { $elemMatch: { size: { $in: sizes } } },
       category:categoryId
    });
    return products;
  } catch (err) {
    console.log(err);
  }
}

async function filtersbyCategory(req, res) {
  const { sizes, colors, sort } = req.body;
  const categoryId = req.params.id ;

  let products;

  if (colors.length == 0 && sizes.length != 0) {
    console.log("filtering for sizes ", sizes);
    products = await getCategoryBySizes(sizes, categoryId);
  } else if (colors.length != 0 && sizes.length == 0) {
    console.log("filtering for colors ", colors);
    products = await getCategoryByColors(colors, categoryId);
  } else if (colors.length != 0 && sizes.length != 0) {
    console.log("filtering for both colors and sizes");

    products = await getCategoryByColorsAndSizes(colors, sizes,categoryId);
  } else {
    console.log("no filter has been applied");
    products = await Products.find({ category: categoryId });
  }

  if (sort === "date") {
    products.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === "alphabet") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "best") {
    products.sort((a, b) => b.order - a.order);
    console.log("sorting by orders");
  }

  return res.json({ products });
}

async function search(req, res) {
  const { name } = req.body;

  try {
    const allProducts = await Products.find();
    const matchedProducts = searchUtil(allProducts, name);
    return res.json({ matchedProducts });
  } catch (e) {
    return res.json({ error: e.message });
  }
}

module.exports = {
  getProductByCollection,
  getProductByColor,
  getAllColors,
  getColorByCollection,
  filters,
  getProductById,
  getAllProducts,
  getProductByCategory,
  getAllCategories,
  getColorByCategory,
  search,
  filtersbyCategory,
  filtersbyCollection
};
