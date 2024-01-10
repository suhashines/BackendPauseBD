const Shirt = require("../database/shirtSizeChart");
const Pant = require("../database/pantSizeChart");
const Tee = require("../database/teeSizeChart");

async function getShirtSizeChart(req, res) {
  try {
    const chart = await Shirt.find();
    return res.json({ suceess: true, chart });
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
}
async function getPantSizeChart(req, res) {
  try {
    const chart = await Pant.find();
    return res.json({ suceess: true, chart });
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
}
async function getTeeSizeChart(req, res) {
  try {
    const chart = await Tee.find();
    return res.json({ suceess: true, chart });
  } catch (e) {
    return res.json({ success: false, error: e.message });
  }
}

module.exports = {
  getPantSizeChart,
  getShirtSizeChart,
  getTeeSizeChart,
};
