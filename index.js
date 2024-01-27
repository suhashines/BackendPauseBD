const express = require('express')
require('./database/connection')
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors())



const productRouter = require('./router/productRouter')
const collectionRouter = require('./router/collectionRouter')
const orderRouter = require('./router/orderRouter')
const adminRouter = require('./router/adminRouter')
const chartRouter = require('./router/chartRouter')
const headerRouter = require('./router/headerRouter')
const footerRouter = require('./router/footerRouter')

const port = process.env.PORT || 5000 ;

app.listen(port,"0.0.0.0",()=>{
    console.log('server is running at port ',port)
})


app.use('/product',productRouter)
app.use('/collection',collectionRouter);
app.use('/order',orderRouter)
app.use('/admin',adminRouter);
app.use('/chart',chartRouter);
app.use('/header',headerRouter)
app.use('/footer',footerRouter);

app.get('/',(req,res)=>{
    res.send('Welcome to the server home page');
})