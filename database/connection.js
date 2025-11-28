const mongoose = require('mongoose');

const dotenv = require("dotenv");
dotenv.config();
// const result = dotenv.config();

// // if (result.error) {
// //   throw result.error;
// // }

// const envVars = result.parsed;
// Object.assign(process.env, envVars);

const db = process.env.db_name ;
const username = process.env.db_username ;
const password = process.env.db_password ;

const connectString = `mongodb+srv://${username}:${password}@cluster0.rfrmrmc.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(connectString,{
}).then(()=>{
    console.log(`Connected with ${db} database`)
}).catch((error)=>{
    console.log(error.message);
})

