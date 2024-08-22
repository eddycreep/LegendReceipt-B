const InvoiceModel = require('../models/invoice.model');

exports.getReceiptData = (req, res) => {
  InvoiceModel.getReceiptData(req, (err, user) => {
    if (err) {
      user.message = "Failed";
      res.send(err);
      process.exit(1);
    }
    user.message = "Success";
    res.send(user);
  })
}