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