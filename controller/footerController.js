const Footer = require('../database/footer');

async function editFooter(req,res){

     await Footer.findOneAndUpdate({},{$set:req.body},{$new:true});
    return res.json({success:true,message:"footer updated successfully"});

}

async function getFooter(req,res){

    const footer = await Footer.find();
    return res.json(footer[0]);
}

module.exports = {
    editFooter,
    getFooter
}