import PDFDocument from "pdfkit-table";

const formatDescription = (description, items) => {
  const itemsString = items.join(", ");
  return `Description: ${description}\nItems: ${itemsString}`;
};

export const buildPdf = (dataCallBack, endCallBack, data) => {
  const { customer, orderDetails, totals } = data;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Add the header
  doc.fontSize(16).text("Ron Tailors", { align: "center" });
  doc.fontSize(12).text("Telephone: 123-456-7890", { align: "center" });
  doc.text("Address: 123 Tailor Street, Fashion City", { align: "center" });

  // Section breaker
  doc.moveDown();
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Add customer details
  doc.moveDown().fontSize(12).text(`Customer Name: ${customer.name}`);
  doc.text(`Mobile: ${customer.mobile}`);
  doc.text(`Order Date: ${customer.orderDate}`);
  doc.text(`Delivery Date: ${customer.deliveryDate}`);
  doc.text(`Wedding Date: ${customer.weddingDate}`);

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

  // Section breaker
  doc.moveDown();
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Add totals
  doc
    .moveDown()
    .fontSize(12)
    .text(`Subtotal: ${totals.subTotal}`, { align: "right" });
  doc.text(`Discount: ${totals.discount}`, { align: "right" });
  doc.text(`Total: ${totals.totalPrice}`, { align: "right" });
  doc.text(`Advance: ${totals.advPayment}`, { align: "right" });
  doc.text(`Balance: ${totals.balance}`, { align: "right" });

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  doc.end();
};
