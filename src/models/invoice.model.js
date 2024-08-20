var dbConn = require("../../config/db.config");

var Invoice = function (user) {
    this.ID = user.ID;
    this.doc_number = user.doc_number;
    this.description = user.description;
    this.incl_price = user.incl_price;
    this.incl_line_total = user.incl_line_total;
    this.tax = user.tax;
    this.sale_date = user.sale_date;
};

Invoice.getInvoice = (req, result) => {
    dbConn.query('SELECT ID, doc_number, description, incl_price, incl_line_total, tax, sale_date FROM erp_ho_demo.tblsaleslines WHERE doc_number = ?', [req.params.docnum], (err, res) => {
        if (!(err === null)) {
            console.log('Error while getting invoice data: ' + err);
            result(null, err)
        } else {
            console.log(res, 'result');
            result(null, res); 
        }
    })
}

Invoice.getReceiptData = (req, result) => {
    dbConn.query('SELECT l.doc_number, l.description, l.incl_price, l.incl_line_total, l.tax, l.sale_date, m.description As store_name, m.address_1, m.address_2, m.address_3, m.address_4, m.address_5, m.address_6, m.address_7, c.Description As customer_name, p.com_logo FROM erp_ho_demo.tblsaleslines l JOIN erp_ho_demo.tblmultistore m ON l.store=m.code JOIN erp_ho_demo.tblcustomers c ON l.customer=c.Code JOIN erp_ho_demo.tblparameters p WHERE doc_number= ?', [req.params.docnum], (err, res) => {
        if (!(err === null)) {
            console.log('Error while getting receipt data: ' + err);
            result(null, err)
        } else {
            console.log(res, 'result');
            result(null, res); 
        }
    })
}


module.exports = Invoice;

