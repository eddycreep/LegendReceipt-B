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

Invoice.getReceiptData = (req, result) => {
    try {
        dbConn.query('SELECT l.doc_number, l.description, l.incl_price, l.incl_line_total, l.tax, l.sale_date, m.description As store_name, m.address_1, m.address_2, m.address_3, m.address_4, m.address_5, m.address_6, m.address_7, c.Description As customer_name, p.com_logo FROM bit_drywall_erp.tblsaleslines l JOIN bit_drywall_erp.tblmultistore m ON l.store=m.code JOIN bit_drywall_erp.tblcustomers c ON l.customer=c.Code JOIN bit_drywall_erp.tblparameters p WHERE doc_number= ?', [req.params.docnum], (err, res) => {
            if (!(err === null)) {
                console.log('Error while getting receipt data: ' + err);
                result(null, err)
            } else {
                console.log(res, 'result');
                result(null, res); 
            }
        })
    } catch (error) {
        console.log('Error when executing receipt data: ', error);
        result(null, error);
    }
}


module.exports = Invoice;

