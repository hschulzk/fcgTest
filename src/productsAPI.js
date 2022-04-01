const express = require('express');
const productsData = require('./data/products.json');
const productsAPI = express();
const appPort = 3002;

productsAPI.use(express.static('public'));

productsAPI.get('/products', (req, res) => {
  res.json(productsData);
});
  
productsAPI.listen(appPort, console.log(`Products API running on ${appPort}`))