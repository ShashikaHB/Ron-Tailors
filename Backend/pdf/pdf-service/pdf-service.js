import PDFDocument from "pdfkit-table";

const formatDescription = (description, items) => {
  const itemsString = items.join(", ");
  return `Description: ${description}\nItems: ${itemsString}`;
};
const formatDescriptionForRent = (details) => {
  return `Description: ${details.description}\nColor: ${details.color} | Size: ${details.size}\nNotes: ${details.notes}`;
};

export const buildSalesPdf = (dataCallBack, endCallBack, data) => {
  const { customer, orderDetails, totals, orderNo } = data;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Add the header
  doc.fontSize(18).text("Ron Tailors", { align: "center" });
  doc.fontSize(14).text("No.176 A,First Floor,Kegalle.", { align: "center" });
  doc.fontSize(13).text("077 887 677 8 / 035 20 5 1600.", { align: "center" });
  doc.fontSize(12).text("kegalleron@gmail.com", { align: "center" });
  doc.fontSize(11).text("www.rontailors.com", { align: "center" });

  doc.moveDown();
  doc.fontSize(16).text("SALES ORDER", { align: "center" });
  doc.fontSize(13).text(`Order No: ${orderNo}`,{ align: "center" })


  // Section breaker
  doc.moveDown();
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Add customer details
  doc.moveDown().fontSize(12).text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.25).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.25).text(`Order Date: ${customer.orderDate}`);
  doc.moveDown(0.25).text(`Delivery Date: ${customer.deliveryDate}`);
  doc.moveDown(0.25).text(`Wedding Date: ${customer.weddingDate}`);

  doc.moveDown();

  // Create table for order details
  const tableData = {
    headers: ["Description and Items", "Amount"],
    rows: orderDetails.map((detail) => [
      formatDescription(detail.description, detail.items),
      detail.amount,
    ]),
  };

  doc.moveDown();
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
    columnSpacing: 15,
    padding: 5,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right, // Full width of the page
    x: doc.page.margins.left, // Position the table within the left margin
  });

  // Add totals
  doc
    .moveDown()
    .fontSize(12)
    .text(`Subtotal: ${totals.subTotal}`, { align: "right" });
  doc.moveDown(0.25).text(`Discount: ${totals.discount}`, { align: "right" });
  doc.moveDown(0.25).text(`Total: ${totals.totalPrice}`, { align: "right" });
  doc.moveDown(0.25).text(`Advance: ${totals.advPayment}`, { align: "right" });
  // Section breaker
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
    doc.moveDown(0.25);
  doc.moveDown(0.25).text(`Balance: ${totals.balance}`, { align: "right" });
  doc.moveDown(0.25);

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  doc.moveDown();
  doc.moveDown(0.35).text(`Thank you. Come again....`, { align: "center" });
  doc.moveDown(0.35).text(`System Made by SharkDev.lk`, { align: "center" });

  doc.end();
};

export const buildRentPdf = (dataCallBack, endCallBack, data) => {
  const { customer, rentOrderDetails, totals, orderNo } = data;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Add the header
  doc.fontSize(18).text("Ron Tailors", { align: "center" });
  doc.fontSize(14).text("No.176 A,First Floor,Kegalle.", { align: "center" });
  doc.fontSize(13).text("077 887 677 8 / 035 20 5 1600.", { align: "center" });
  doc.fontSize(12).text("kegalleron@gmail.com", { align: "center" });
  doc.fontSize(11).text("www.rontailors.com", { align: "center" });

  doc.moveDown();
  doc.fontSize(16).text("RENT BILL", { align: "center" });
  doc.fontSize(13).text(`Order No: ${orderNo}`,{ align: "center" })

  // Section breaker
  doc.moveDown();
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Add customer details
  doc.moveDown().fontSize(12).text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.25).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.25).text(`Rent Date: ${customer.rentDate}`);
  doc.moveDown(0.25).text(`Return Date: ${customer.returnDate}`);

  doc.moveDown(2);

  // Create table for order details
  const tableData = {
    headers: ["Description and Items", "Amount"],
    rows: rentOrderDetails.map((detail) => [
      formatDescriptionForRent(detail),
      detail.amount,
    ]),
  };

  doc.moveDown();
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
    columnSpacing: 15,
    padding: 5,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right, // Full width of the page
    x: doc.page.margins.left, // Position the table within the left margin
  });

  // Add totals
  doc
    .moveDown()
    .fontSize(12)
    .text(`Subtotal: ${totals.subTotal}`, { align: "right" });
  doc.moveDown(0.25).text(`Discount: ${totals.discount}`, { align: "right" });
  doc.moveDown(0.25).text(`Total: ${totals.totalPrice}`, { align: "right" });
  doc.moveDown(0.25).text(`Advance: ${totals.advPayment}`, { align: "right" });
  // Section breaker
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
    doc.moveDown(0.25);
  doc.moveDown(0.25).text(`Balance: ${totals.balance}`, { align: "right" });
  doc.moveDown(0.25);

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  doc.moveDown();
  doc.moveDown(0.35).text(`Thank you. Come again....`, { align: "center" });
  doc.moveDown(0.35).text(`System Made by SharkDev.lk`, { align: "center" });

  doc.end();
};
