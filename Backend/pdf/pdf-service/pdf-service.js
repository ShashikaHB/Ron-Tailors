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
  doc.fontSize(13).text(`Order No: ${orderNo}`, { align: "center" });

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
  doc
    .moveDown(0.35)
    .fontSize(10)
    .text(`System Made by SharkDev.lk`, { align: "center" });

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
  doc.fontSize(13).text(`Order No: ${orderNo}`, { align: "center" });

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
export const buildRentShopPdf = (dataCallBack, endCallBack, data) => {
    const { customer, rentOrderDetails, totals, orderNo } = data;
  
    const doc = new PDFDocument({ margin: 30, size: "A4" });
  
    doc.on("data", dataCallBack);
    doc.on("end", endCallBack);
  
    // Add customer details
    doc.moveDown().fontSize(12).text(`Customer Name: ${customer.name}`);
    doc.moveDown(0.25).text(`Mobile: ${customer.mobile}`);
    doc.moveDown(0.5)

    doc.fontSize(12).font("Helvetica-Bold").text(`Rent No: ${orderNo}`);
    doc.moveDown(0.5)
    doc.fontSize(12).font("Helvetica-Bold").text(`Rent Date: ${customer.rentDate}`);


    doc.moveDown(2);
  
      // Loop through rentOrderDetails and print each item on a new line
  rentOrderDetails.forEach((detail) => {
    doc.fontSize(11).font("Helvetica").text(`Bar Code: ${detail.rentItemId}`);
    doc.moveDown(0.5);

    doc.text(`${detail.description}`);
    doc.moveDown(0.5);

    doc.text(`Color: ${detail.color}`);
    doc.moveDown(0.5);

    doc.text(`Hand length: ${detail.handLength}`);
    doc.moveDown(0.5);

    doc.text(`Hand length: ${detail.notes}`);
    doc.moveDown(0.5);

    doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  });
  
    doc.end();
  };
export const buildReadyMadePdf = (dataCallBack, endCallBack, data) => {
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
  doc.fontSize(16).text("Ready Made Item bill", { align: "center" });
  doc.fontSize(13).text(`Order No: ${orderNo}`, { align: "center" });

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

  doc.moveDown(2);

  // Create table for order details
  const tableData = {
    headers: ["Description and Items", "Amount"],
    rows: orderDetails.map((detail) => [detail.description, detail.amount]),
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

  doc.text(`Total: ${totals.totalPrice}`, { align: "right" });


  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  doc.moveDown();
  doc.moveDown(0.35).text(`Thank you. Come again....`, { align: "center" });
  doc.moveDown(0.35).text(`System Made by SharkDev.lk`, { align: "center" });

  doc.end();
};
export const buildMeasurementPdf = (dataCallBack, endCallBack, data) => {
  const doc = new PDFDocument({ margin: 30, size: "A4" });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // For each measurement in the data, we will add the details to the PDF
  data.forEach((measurement, index) => {
    const {
      customer,
      itemType,
      measurements,
      style,
      remarks,
      estimatedReleaseDate,
      isNecessary,
    } = measurement;

    // Add a section breaker for each measurement
    if (index > 0) {
      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();
      doc.moveDown(1);
    }

    // Add customer name, mobile, and item type
    doc
      .fontSize(13)
      .text(`${customer.name} |  ${customer.mobile} | ${itemType}`);

    doc.moveDown(0.5);

    // Add the measurements array with spacing
    doc.fontSize(12).text(`${measurements.join(" | ")}`);
    doc.moveDown(0.5);

    // Add style information
    doc.fontSize(12).text(`${style}`);
    doc.moveDown(0.5);

    // Add remarks
    doc.fontSize(12).text(`Remarks: ${remarks}`);
    doc.moveDown(0.5);

    // Add estimated release date and necessary status side by side
    const formattedReleaseDate = new Date(
      estimatedReleaseDate
    ).toLocaleDateString();
    doc.fontSize(12).text(`Release Date: ${formattedReleaseDate}`, {
      continued: true, // Keeps the text on the same line
    });

    if (isNecessary) {
      doc
        .font("Helvetica-Bold") // Make the text bold
        .text(`   Necessary`, {
          align: "left", // Aligns the text to the right
          continued: false, // Ensures the text ends here and doesn't continue
        })
        .font("Helvetica"); // Reset to default font
    }

    doc.moveDown(2);
  });

  doc.end();
};
