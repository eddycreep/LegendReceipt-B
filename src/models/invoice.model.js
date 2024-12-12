var dbConn = require("../../config/db.config");

var Invoice = function (user) {
    this.ID = user.ID;
    this.doc_number = user.doc_number;
    this.description = user.description;
    this.incl_price = user.incl_price;
    this.incl_line_total = user.incl_line_total;
    this.tax = user.tax;
    this.sale_date = user.sale_date;
    this.store_name = user.store_name;
    this.address_1 = user.address_1;
    this.address_2 = user.address_2;
    this.address_3 = user.address_3;
    this.address_4 = user.address_4;
    this.address_5 = user.address_5;
    this.address_6 = user.address_6;
    this.address_7 = user.address_7;
    this.customer_name = user.customer_name;
    this.com_logo = user.com_logo;
};

Invoice.getInvoiceData = (req, result) => {
    dbConn.query('SELECT doc_number, description, incl_price, incl_line_total, tax, sale_date FROM bit_drywall_erp.tblsaleslines WHERE doc_number = ?', [req.params.doc_number], (err, res) => {
        if (!(err === null)) {
            console.log('Error while fetching the invoice data: ' + err);
            result(null, err)
        } else {
            console.log(res, 'Invoice Data Result: ');
            result(null, res); 
        }
    })
}


Invoice.getInvoiceAddressData = (req, result) => {
    dbConn.query('SELECT m.description AS store_name, m.address_1, m.address_2, m.address_3, m.address_4, m.address_5, m.address_6, m.address_7 FROM bit_drywall_erp.tblsaleslines l JOIN bit_drywall_erp.tblmultistore m ON l.store = m.code WHERE doc_number = ? LIMIT 1', [req.params.doc_number], (err, res) => {
        if (!(err === null)) {
            console.log('Error while fetching the invoice address data: ' + err);
            result(null, err)
        } else {
            console.log(res, 'Invoice Address Data Result: ');
            result(null, res); 
        }
    })
}


module.exports = Invoice;

