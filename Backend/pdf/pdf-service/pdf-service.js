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

  // Set up the document for 80mm width
  const doc = new PDFDocument({
    size: [227, 500], // 80mm width, variable height
    margins: { top: 10, bottom: 10, left: 5, right: 5 },
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Header Section
  doc.fontSize(10).text("Ron Tailors", { align: "center" });
  doc.fontSize(8).text("No.176 A,First Floor,Kegalle.", { align: "center" });
  doc.fontSize(8).text("077 887 677 8 / 035 20 5 1600.", { align: "center" });
  doc.fontSize(7).text("kegalleron@gmail.com", { align: "center" });
  doc.fontSize(7).text("www.rontailors.com", { align: "center" });

  doc.moveDown(0.5);
  doc.fontSize(10).text("SALES ORDER", { align: "center" });
  doc.fontSize(8).text(`Order No: ${orderNo}`, { align: "center" });

  // Section Divider
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Customer Details
  doc.moveDown(0.5).fontSize(8).text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.15).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.15).text(`Order Date: ${customer.orderDate}`);
  doc.moveDown(0.15).text(`Delivery Date: ${customer.deliveryDate}`);
  doc.moveDown(0.15).text(`Wedding Date: ${customer.weddingDate ?? ""}`);

  doc.moveDown(1);

  // Table for Order Details
  const tableData = {
    headers: ["Description", "Amount"],
    rows: orderDetails.map((detail) => [
      formatDescription(detail.description, detail.items),
      detail.amount,
    ]),
  };

  doc.moveDown(0.3);
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7),
    columnSpacing: 8,
    padding: 4,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    x: doc.page.margins.left,
  });

  // Totals Section
  doc
    .moveDown(0.5)
    .fontSize(8)
    .text(`Subtotal: ${totals.subTotal}`, { align: "right" });
  doc.moveDown(0.15).text(`Discount: ${totals.discount}`, { align: "right" });
  doc.moveDown(0.15).text(`Total: ${totals.totalPrice}`, { align: "right" });
  doc.moveDown(0.15).text(`Advance: ${totals.advPayment}`, { align: "right" });

  // Balance Section
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.15);
  doc.moveDown(0.15).text(`Balance: ${totals.balance}`, { align: "right" });

  // Final Message
  doc.moveDown(0.2);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.5);
  doc.fontSize(7).text(`Thank you. Come again....`, { align: "center" });
  doc.moveDown(0.15).text(`System Made by SharkDev.lk`, { align: "center" });

  doc.end();
};

export const buildRentPdf = (dataCallBack, endCallBack, data) => {
  const { customer, rentOrderDetails, totals, orderNo } = data;

  // Set the page size to 80mm width and a reasonable height
  const doc = new PDFDocument({
    size: [227, 500], // Width: 80mm, Height: Dynamic
    margins: { top: 10, bottom: 10, left: 5, right: 5 }, // Narrow margins
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Header section
  doc.fontSize(10).text("Ron Tailors", { align: "center" });
  doc.fontSize(8).text("No.176 A,First Floor,Kegalle.", { align: "center" });
  doc.fontSize(8).text("077 887 677 8 / 035 20 5 1600.", { align: "center" });
  doc.fontSize(7).text("kegalleron@gmail.com", { align: "center" });
  doc.fontSize(7).text("www.rontailors.com", { align: "center" });

  doc.moveDown(0.5);
  doc.fontSize(8).text("RENT BILL", { align: "center" });
  doc.fontSize(7).text(`Order No: ${orderNo}`, { align: "center" });

  // Section divider
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Customer Details
  doc.moveDown(0.5).fontSize(8).text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.15).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.15).text(`Rent Date: ${customer.rentDate}`);
  doc.moveDown(0.15).text(`Return Date: ${customer.returnDate}`);

  doc.moveDown(1);

  // Order Details Table
  const tableData = {
    headers: ["Description", "Amount"],
    rows: rentOrderDetails.map((detail) => [
      formatDescriptionForRent(detail),
      detail.amount,
    ]),
  };

  doc.moveDown(0.3);
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7),
    columnSpacing: 8,
    padding: 4,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    x: doc.page.margins.left,
  });

  // Totals
  doc
    .moveDown(0.5)
    .fontSize(8)
    .text(`Subtotal: ${totals.subTotal}`, { align: "right" });
  doc.moveDown(0.15).text(`Discount: ${totals.discount}`, { align: "right" });
  doc.moveDown(0.15).text(`Total: ${totals.totalPrice}`, { align: "right" });
  doc.moveDown(0.15).text(`Advance: ${totals.advPayment}`, { align: "right" });

  // Balance
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.15);
  doc.moveDown(0.15).text(`Balance: ${totals.balance}`, { align: "right" });

  // Final message
  doc.moveDown(0.2);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.5);
  doc.fontSize(7).text(`Thank you. Come again....`, { align: "center" });
  doc.moveDown(0.15).text(`System Made by SharkDev.lk`, { align: "center" });

  doc.end();
};

export const buildRentShopPdf = (dataCallBack, endCallBack, data) => {
  const { customer, rentOrderDetails, totals, orderNo } = data;

  // Define the document with 80mm width, and reduce margins for compact printing
  const doc = new PDFDocument({
    size: [227, 400], // 80mm width, height set to allow pagination
    margins: { top: 10, bottom: 10, left: 5, right: 5 },
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Add customer details with scaled-down font sizes
  doc.moveDown(0.2).fontSize(9).text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.15).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.5);

  doc.fontSize(10).font("Helvetica-Bold").text(`Rent No: ${orderNo}`);
  doc.moveDown(0.2);

  // Loop through rentOrderDetails with reduced spacing and smaller font size
  rentOrderDetails.forEach((detail) => {
    doc.fontSize(8).font("Helvetica").text(`Barcode: ${detail.rentItemId}`);
    doc.moveDown(0.2);

    doc.text(`Description: ${detail.description}`);
    doc.moveDown(0.2);

    doc.text(`Color: ${detail.color}`);
    doc.moveDown(0.2);

    doc.text(`Size: ${detail.size}`);
    doc.moveDown(0.2);

    doc.text(`Hand Length: ${detail.handLength}`);
    doc.moveDown(0.2);

    doc.text(`Notes: ${detail.notes}`);
    doc.moveDown(0.5);

    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
    doc.moveDown(1);
  });

  doc.fontSize(8).text(`Suit Type: ${customer.suitType}`);
  doc.moveDown(0.2);
  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(`Rent Date: ${customer.rentDate}`);

  doc.end();
};

export const buildReadyMadePdf = (dataCallBack, endCallBack, data) => {
  const { customer, orderDetails, totals, orderNo } = data;

  // Define the document with 80mm width, reduced margins, and smaller default font sizes
  const doc = new PDFDocument({
    size: [227, 400], // 80mm width, height is scalable to content
    margins: { top: 10, bottom: 10, left: 5, right: 5 },
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  // Add the header with reduced font sizes
  doc.fontSize(10).text("Ron Tailors", { align: "center" });
  doc.fontSize(8).text("No.176 A, First Floor, Kegalle.", { align: "center" });
  doc.fontSize(8).text("077 887 677 8 / 035 20 5 1600", { align: "center" });
  doc.fontSize(7).text("kegalleron@gmail.com", { align: "center" });
  doc.fontSize(7).text("www.rontailors.com", { align: "center" });

  doc.moveDown(0.3);
  doc.fontSize(10).text("Ready Made Item Bill", { align: "center" });
  doc.fontSize(8).text(`Order No: ${orderNo}`, { align: "center" });

  // Section breaker
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Add customer details with compact formatting
  doc.moveDown(0.3).fontSize(8).text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.2).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.2).text(`Order Date: ${customer.orderDate}`);

  doc.moveDown(0.5);

  // Create table for order details with scaled-down font and spacing
  const tableData = {
    headers: ["Description and Items", "Amount"],
    rows: orderDetails.map((detail) => [detail.description, detail.amount]),
  };

  doc.moveDown(0.2);
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7),
    columnSpacing: 10,
    padding: 3,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right, // Full width of the page
    x: doc.page.margins.left, // Position the table within the left margin
  });

  doc.moveDown(0.5);
  doc.fontSize(8).text(`Total: ${totals.totalPrice}`, { align: "right" });

  // Section breaker
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  doc.moveDown(0.3);
  doc.fontSize(7).text(`Thank you. Come again....`, { align: "center" });
  doc.fontSize(6).text(`System Made by SharkDev.lk`, { align: "center" });

  doc.end();
};

export const buildMeasurementPdf = (dataCallBack, endCallBack, measurement) => {
  const doc = new PDFDocument({
    size: [226, 500], // Width in points (80mm = 226.8 points, 500 for enough height)
    margin: 10, // Smaller margin for narrow printing area
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  const {
    customer,
    itemType,
    measurements,
    style,
    remarks,
    estimatedReleaseDate,
    isNecessary,
    orderId,
  } = measurement;

  // Adjusted font sizes for POS printer and concise layout
  doc
    .fontSize(11)
    .text(`${orderId} | ${customer.name} | ${itemType}`, {
      align: "left",
    });
  doc.moveDown(0.3);

  // Add measurements with filtered values and smaller font size
  doc
    .fontSize(10)
    .text(measurements, { align: "left" });
  doc.moveDown(0.3);

  // Add style information
  doc.fontSize(10).text(`Style: ${style}`, { align: "left" });
  doc.moveDown(0.3);

  // Add remarks
  doc.fontSize(10).text(`Remarks: ${remarks}`, { align: "left" });
  doc.moveDown(0.3);

  // Add release date and necessary status
  const formattedReleaseDate = new Date(
    estimatedReleaseDate
  ).toLocaleDateString();
  doc.fontSize(10).text(`Release Date: ${formattedReleaseDate}`, {
    align: "left",
    continued: true,
  });

  if (isNecessary) {
    doc
      .font("Helvetica-Bold")
      .text(" Necessary", { align: "left", continued: false });
  }

  // End document generation
  doc.end();
};

export const buildOrderBookPdf = (
  dataCallBack,
  endCallBack,
  data,
  deliveryDate
) => {
  const doc = new PDFDocument({ margin: 30 });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`Order Book of the Date ${deliveryDate}`, { align: "center" });

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(1);

  data.map((item, index) => {
    // Add customer name, mobile, and item type
    const { customer, orderData, salesOrderId } = item;
    if (index > 0) {
      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();
      doc.moveDown(1);
    }
    // Set X-positions for even spacing
    const left = doc.page.margins.left; // Left margin position
    const middle1 = left + 50; // Adjust the spacing for customer name
    const middle2 = middle1 + 100; // Adjust the spacing for mobile number

    // Draw each field with specified X-coordinates
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text(`Order No: ${salesOrderId}`, left, doc.y, { continued: true });
    doc.text(`${customer.name}`, middle1, doc.y, { continued: true });
    doc.text(`Mobile: ${customer.mobile}`, middle2, doc.y);

    doc.moveDown(1);

    orderData.forEach((item, index) => {
      // Add a section breaker for each measurement
      // Add customer name, mobile, and item type
      doc
        .fontSize(13)
        .font("Helvetica")
        .text(`${item.productType}`, left, doc.y, { continued: true });
      doc.text(`${item.description}`, middle2, doc.y);
      doc.moveDown(1);
    });
  });

  doc.end();
};
