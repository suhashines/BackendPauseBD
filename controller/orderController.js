const Pendings = require("../database/pending");
const Products = require("../database/products");
const Delivery = require('../database/orderChart')
const Admin = require('../database/admins');

const nodemailer = require("nodemailer");

const MailGen = require("mailgen");

const dotenv = require("dotenv");

async function calculateUtil(cart){

  const cartDetails = await Promise.all(
    cart.map(async (cartItem) => {
      const product = await Products.findById(cartItem.id);

      // Step 2: Calculating prices with and without discounts
      const withoutDiscount = Math.ceil(product.price * cartItem.quantity);
      const withDiscount = Math.ceil(withoutDiscount * (1 - product.discount / 100));

      // Step 3: Formatting the response
      return {
        name: product.name,
        size: cartItem.size,
        color: cartItem.color,
        quantity: cartItem.quantity,
        price:withDiscount
      };
    })
  );

  const total = cartDetails.reduce(
    (sum, item) => sum + item.price,
    0
  );
  
  return {
    cart: cartDetails,
    total: total
  }

}


async function calculate(cart){  

    // Step 1: Querying the Products collection for each item in the cart

    const cartDetails = await Promise.all(
      cart.map(async (cartItem) => {
        const product = await Products.findById(cartItem.id); 

        console.log("I have got the product", product);

        // Step 2: Calculating prices with and without discounts
        const withoutDiscount = Math.ceil(product.price * cartItem.quantity);
        const withDiscount = Math.ceil(withoutDiscount * (1 - product.discount / 100));

        // Step 3: Formatting the response
        return {
          id: cartItem.id,
          name: product.name,
          size: cartItem.size,
          color: cartItem.color,
          quantity: cartItem.quantity,
          withoutDiscount,
          withDiscount,
        };
      })
    );

   

    // Step 4: Calculating the total
    const totalWithoutDiscount = cartDetails.reduce(
      (sum, item) => sum + item.withoutDiscount,
      0
    );

    const totalWithDiscount = cartDetails.reduce(
      (sum, item) => sum + item.withDiscount,
      0
    );

    // Responding with the formatted data
    return {
      cart: cartDetails,
      total: {
        netTotalWithoutDiscount: totalWithoutDiscount,
        netTotalWithDiscount: totalWithDiscount
      }
    } ;

}

async function findDeliveryCharge(order){

  const inDhaka = order.inDhaka ;

  const deliveryCharge = await Delivery.find();

  const {insideDhaka,outsideDhaka} = deliveryCharge[0];

  let charge ;

  if(inDhaka){
    charge = insideDhaka;
    console.log("found in dhaka charge ",charge);
  }else{
    charge = outsideDhaka;
    console.log("found outside dhaka charge ",charge);
  }

  return charge ;
}

async function calculateOrder(req, res) {

  try {

    const cart = await calculate(req.body.cart);

    return res.json({order:cart});

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function confirmOrder(req, res) {
  
  const order = req.body ;
   const date = new Date();

  order.date = date ;

  const newOrder = new Pendings(order);

  const savedOrder = await newOrder.save();

  console.log(savedOrder);

  const cart = await calculateUtil(req.body.cart);

  console.log(cart);

  const email = req.body.email;
  const name = req.body.name ;

  const userIntro = "Dear "+name+" ,your bill has arrived" ;
  const ownerIntro = "Dear owner an order has been placed " ;

  let outro = "Looking forward to doing more business with you ≽^•⩊•^≼ "

  let isSent ;

   isSent = await sendMail(cart.cart,cart.total,email,userIntro,outro);

  if(isSent==0){
    return res.json({sucess:false,msg:"An error occured while sending the mail. Please contact us via phone"});
  }

  //now sending mail to the owner

  const admin = await Admin.find();

  const ownerEmail = admin[0].email ; 

  console.log(ownerEmail);

  const {phone,thana,road,building,transactionId,otherDetails} = req.body;

  outro = "Name: "+name+", Phone: "+phone+", Thana: "+thana+", Transaction Id: "+transactionId+ ", Road: "+road+", Building: "+building+", Other Details: "+otherDetails; ;

  console.log("got owner outro ",outro);

  await sendMail(cart.cart,cart.total,ownerEmail,ownerIntro,outro);

  return res.json({success:true,msg: "you should receive an email shortly"})

}



async function sendMail(cart,total,userEmail,intro,outro) {


  const receiver = userEmail;
  console.log("sending mail to ",receiver);

  console.log("cart:",cart);
  console.log("total:",total);

  console.log("total to pay ",total);

  const footer = {
    name:"",
    size:"",
    color:"",
    quantity : "Total",
    price : total
  }
  cart.push(footer);

  console.log(cart);

  const email = process.env.email;
  const password = process.env.app_password;

  console.log("user-email: ",receiver);

  let config = {
    service: "gmail",
    auth: {
      user: `${email}`,
      pass: `${password}`
    }
  };

  let transporter = nodemailer.createTransport(config);

  let mailGen = new MailGen({
    theme: "default",
    product: {
      name: "PauseBD",
      link: "https://www.instagram.com/pause.bd/",
    },
  });


  let response = {
    body: {
      intro: intro,

      table: {
        data: cart 
      },
     

      outro : outro
    }
  };

  let mail = mailGen.generate(response) ;


  let message = {
     from : email,
     to : receiver,
     subject : "Place Order" ,
     html : mail
  }

  transporter.sendMail(message).then(()=>{
    console.log("Mail has been sent");
    return 1 ;
  }).catch(error=>{
    console.log(error.message);
    return 0 ;
  })

}

async function editDeliveryCharge(req,res){

    const newDeliveryCharge = await Delivery.findOneAndUpdate(
      {},
      {$set:req.body},
      {new:true}
    ) ;

    return res.json({success:true,deliveryCharge:newDeliveryCharge});
    
}

async function addDeliveryCharge(req,res){

  const charge = req.body ;

  const newDeliveryCharge = new Delivery(charge);

  await newDeliveryCharge.save();

  return res.json({success:true});
}

async function getDeliveryCharge(req,res){

  console.log("Get DeliveryCharge");

  const deliveryCharge = await Delivery.find();

  return res.json({deliveryCharge:deliveryCharge[0]});
}

module.exports = {
  calculateOrder,
  confirmOrder,
  sendMail,
  addDeliveryCharge,
  editDeliveryCharge,
  getDeliveryCharge,
  calculateUtil
};
