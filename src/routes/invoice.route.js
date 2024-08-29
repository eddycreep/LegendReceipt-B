const express = require('express');
const router = express.Router();

const InvoiceController = require('../controllers/invoice.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/getreceiptdata/:docnum', InvoiceController.getReceiptData); //test - testing

module.exports = router;
