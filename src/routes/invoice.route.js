const express = require('express');
const router = express.Router();

const InvoiceController = require('../controllers/invoice.controller');

require('dotenv').config({ path: './configuration.env' });

router.get('/get-invoice-data/:doc_number', InvoiceController.getInvoiceData);

router.get('/get-invoice-address-data/:doc_number', InvoiceController.getInvoiceAddressData);

module.exports = router;
