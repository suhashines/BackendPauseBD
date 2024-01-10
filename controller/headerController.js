const Headers = require('../database/headers');


async function getHeaders(req,res){
    const headers = await Headers.find();
    return res.json(headers[0]);
}

async function setHeaders(req,res){

    const newHeader = new Headers(req.body);
    const savedHeader = await newHeader.save();
    return res.json(savedHeader);
}

async function editHeaders(req,res){

    const header = await Headers.findOneAndUpdate({},req.body,{new:true});
    return res.json(header);

}

module.exports = {
    editHeaders,
    getHeaders,
    setHeaders
}


