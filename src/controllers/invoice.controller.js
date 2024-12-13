const InvoiceModel = require('../models/invoice.model');

exports.getInvoiceData = (req, res) => {
  InvoiceModel.getInvoiceData(req, (err, user) => {
    if (err) {
      user.message = "Get Invoice Data - Failed";
      res.send(err);
      process.exit(1);
    }
    user.message = "Get Invoice Data - Success";
    res.send(user);
  })
}

exports.getInvoiceAddressData = (req, res) => {
  InvoiceModel.getInvoiceAddressData(req, (err, user) => {
    if (err) {
      user.message = "Get Invoice Address Data - Failed";
      res.send(err);
      process.exit(1);
    }
    user.message = "Get Invoice Address Data - Success";
    res.send(user);
  })
}