const express = require('express');
const router = express.Router();

const InvoiceController = require('../controllers/invoice.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/get-invoice-data/:doc_number', InvoiceController.getInvoiceData);

module.exports = router;
