const Admin = require("../database/admins");
const bcrypt = require("bcrypt");
const Collection = require("../database/collections");
const Pending = require("../database/pending");
const Product = require("../database/products");
const nodemailer = require("nodemailer");
const MailGen = require("mailgen");
const dotenv = require("dotenv");

const { calculateUtil } = require("../controller/orderController");
const colors = require('../database/colors');


async function getProductWiseIncome(req, res) {
  try {
    const products = await Product.find();

    // Calculate income for each product
    const productsWithIncome = products.map((product) => ({
      id: product._id,
      name: product.name,
      income: Math.ceil(
        product.order * product.price * (1 - product.discount / 100)
      ), // Adjust this calculation based on your actual fields
    }));

    productsWithIncome.sort((a,b)=>b.income-a.income);

    // Send the response with the products array

    const collections = await Collection.find();

    // Calculate income for each collection
    const collectionsWithIncome = collections.map((collection) => {

      const collectionProducts = products.filter((product) =>
        product.collection.equals(collection._id)
      );
      const income = collectionProducts.reduce((totalIncome, product) => {
        return totalIncome + Math.ceil( product.order * product.price*(1-product.discount / 100));
      }, 0);

      return {
        id: collection._id,
        name: collection.name,
        income: income
      };
    });

    collectionsWithIncome.sort((a,b)=>b.income-a.income);

    res.json({ products: productsWithIncome, collection:collectionsWithIncome});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addProduct(req, res) {
  try {
    const product = await Product.find({ name: req.body.name });

    if (product.length != 0) {
      return res.json({ success: false, error: "Product already exists" });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    return res.json({ savedProduct });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
}

async function editProduct(req, res) {
  const productId = req.params.id;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { $set: req.body },
      { new: true }
    );

    return res.json({ success: true, updatedProduct });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
}

async function deleteProduct(req, res) {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete({ _id: productId });

    return res.json({ success: true, deletedProduct });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
}

async function sendMail(userEmail, date, total) {
  const receiver = userEmail;
  console.log("sending mail to ", receiver);

  if(date==null){
    date = "a couple of days" ;
  }

  const email = process.env.email;
  const password = process.env.app_password;

  console.log("user-email: ", receiver);

  let config = {
    service: "gmail",
    auth: {
      user: `${email}`,
      pass: `${password}`,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mailGen = new MailGen({
    theme: "default",
    product: {
      name: "PauseBD",
      link: "https://www.instagram.com/pause.bd/",
    },
  });

  let intro =
    "Your order will be delivered within " +
    date +
    ".Please pay BDT " +
    total +
    " Tk";
  let outro = "Looking forward to doing more business with you ≽^•⩊•^≼ ";

  let response = {
    body: {
      intro: intro,

      outro: outro,
    },
  };

  let mail = mailGen.generate(response);

  let message = {
    from: email,
    to: receiver,
    subject: "Order Delivery",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      console.log("Mail has been sent");
    })
    .catch((error) => {
      console.log(error.message);
    });
}

async function confirmOrder(req, res) {
  
  const orderId = req.params.id;
  let date = req.body.date;

  console.log("Order id: " + orderId, " is getting confirmed");

  try {
    // Step 1: Find the Pending Order
    const pendingOrder = await Pending.findById(orderId);

    if (!pendingOrder) {
      console.log("Order not found");
      return res.json({"error": "Order not found"});
    }

    // Step 2: Retrieve Products in the Cart 
    const cart = pendingOrder.cart;

    const { total } = await calculateUtil(cart);

    const mail = pendingOrder.email;

    await sendMail(mail, date,total);

    // Step 3: Update Products
    for (const cartItem of cart) {
      const productId = cartItem.id;
      const product = await Product.findById(productId);

      if (!product) {
        console.log(`Product with ID ${productId} not found`);
        continue;
      }

      const colorEntry = product.colors.find((color) =>
        new RegExp(cartItem.color, "i").test(color.name)
      );

      if (colorEntry) {
        const sizeEntry = colorEntry.sizes.find((size) =>
          new RegExp(cartItem.size, "i").test(size.size)
        );

        if (sizeEntry) {
          // Update inStock and order fields
          sizeEntry.inStock -= cartItem.quantity;
          product.order += cartItem.quantity;

          // Save the changes
          await product.save();
        }
      }
    }

    // Step 4: Update Collections
    for (const cartItem of cart) {
      const productId = cartItem.id;
      const product = await Product.findById(productId);

      if (product) {
        const collection = await Collection.findById(product.collection);

        if (collection) {
          // Update collection order field
          collection.order += cartItem.quantity;

          // Save the changes
          await collection.save();
        }
      }
    }

    pendingOrder.isDelivered = true; 

    // Save the changes to the pendingOrder
    await pendingOrder.save();

    await Pending.findByIdAndDelete(orderId);

    console.log("Order processed successfully");

    return res.json({ success: true, message: "Order processed successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    return res.json({ success: false, message: "Error processing order" });
  }
}

async function getPendingOrders(req, res) {
  
  const pendings = await Pending.find({ isDelivered: false }).populate('cart.id', 'name');;

  // but before sending the pending orders, I want to add name attribute to the cart field which
  // will contain the name of the product ( by searching the product by its id from the Products Schema)
  pendings.sort((a,b)=>b.date-a.date);

  return res.json({ pendings });
}

async function signup(req, res) {
  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin with the hashed password
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save the new admin to the database
    const savedAdmin = await newAdmin.save();

    // Omit the password from the response for security
    const responseAdmin = savedAdmin.toObject();
    delete responseAdmin.password;

    res.status(201).json(responseAdmin);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({ success: false, error: "Invalid Email" });
    }

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.json({ success: false, error: "Invalid Password" });
    }
    const responseAdmin = admin.toObject();
    delete responseAdmin.password;
    res.json({ success: true, admin: responseAdmin });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function editAccount(req, res) {
  const adminId = req.params.id;

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedAdmin = await Admin.findByIdAndUpdate(
    { _id: adminId },
    { $set: { email: email, password: hashedPassword } },
    { new: true }
  );

  const responseAdmin = updatedAdmin.toObject();
  delete responseAdmin.password;

  return res.json({ success: true, admin: responseAdmin });
}


async function selectColor(req,res){
  return res.json({colors});
}


module.exports = {
  signup,
  login,
  editAccount,
  confirmOrder,
  getPendingOrders,
  addProduct,
  editProduct,
  deleteProduct,
  getProductWiseIncome,
  selectColor
};
