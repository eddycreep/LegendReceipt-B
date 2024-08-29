const InvoiceModel = require('../models/invoice.model');

exports.getReceiptData = (req, res) => {
  InvoiceModel.getReceiptData(req, (err, user) => {
    if (err) {
      user.message = "Failed";
      res.send(err);
      return res.status(500).send(err);
    }
    user.message = "Success";
    res.send(user);
  })
}