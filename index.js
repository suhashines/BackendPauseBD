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


app.use('api/product',productRouter)
app.use('api/collection',collectionRouter);
app.use('api/order',orderRouter)
app.use('api/admin',adminRouter);
app.use('api/chart',chartRouter);
app.use('api/header',headerRouter)
app.use('api/footer',footerRouter);

app.get('/',(req,res)=>{
    res.send('Welcome to the server home page');
})