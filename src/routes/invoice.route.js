const express = require('express');
const router = express.Router();

const InvoiceController = require('../controllers/invoice.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/getreceiptdata/:docnum', (req, res) => {  
    console.log('Received request to get receipt data for docnum:', req.params.docnum);  
    InvoiceController.getReceiptData(req, (err, user) => {  
     if (err) {  
      console.error('Error getting receipt data:', err);  
      res.status(500).send(err);  
     } else {  
      console.log('Received receipt data:', user);  
      res.send(user);  
     }  
    });  
  }); //test - testing

module.exports = router;
