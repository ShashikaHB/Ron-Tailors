import PDFDocument from "pdfkit-table";

const formatDescription = (description, items) => {
  const itemsString = items.join(", ");
  return `Description: ${description}\nItems: ${itemsString}`;
};
const formatDescriptionForRent = (details) => {
  return `Barcode: ${details.rentItemId}\nDescription: ${details.description}\nColor: ${details.color} | Size: ${details.size}\nNotes: ${details.notes}`;
};

const formatRentOrderDataForBook = (rentOrders) => {
  const orderDetails = rentOrders.map((item) => {
    return `${formatDescriptionForRent(item)}\n`;
  });
  return orderDetails.join("\n");
};

export const buildSalesPdf = (dataCallBack, endCallBack, data) => {
  const { customer, orderDetails, totals, orderNo, store } = data;

  // Set up the document for 80mm width
  const doc = new PDFDocument({
    size: [227, 500], // 80mm width, variable height
    margins: { top: 10, bottom: 10, left: 20, right: 20 },
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  const address =
    store === "KE"
      ? "No.176 A, First Floor, Kegalle."
      : "607, Colombo Road, Ranwala, Kegalle.";
  const email =
    store === "KE" ? "kegalleron@gmail.com" : "rontailorsranwala@gmail.com";
  const phone =
    store === "KE"
      ? "077 887 6778 / 035 205 1600"
      : "071 405 1601 / 035 205 1601";

  // Header Section
  doc.fontSize(10 * 1.2).text("Ron Tailors", { align: "center" });
  doc.fontSize(8 * 1.2).text(address, { align: "center" });
  doc.fontSize(8 * 1.2).text(phone, { align: "center" });
  doc.fontSize(7 * 1.2).text(email, { align: "center" });
  doc.fontSize(7 * 1.2).text("www.rontailors.com", { align: "center" });

  doc.moveDown(0.5);
  doc.fontSize(10 * 1.2).text("SALES ORDER", { align: "center" });
  doc.fontSize(8 * 1.2).text(`Order No: ${orderNo}`, { align: "center" });

  // Section Divider
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Customer Details
  doc
    .moveDown(0.5)
    .fontSize(8 * 1.2)
    .text(`Customer Name: ${customer.name}`);
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
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8 * 1.2),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7 * 1.2),
    columnSpacing: 8,
    padding: 4,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    x: doc.page.margins.left,
  });

  let rightCenterX = doc.page.width * 0.4;
  const amountX = rightCenterX + 10; // Adjust amountX as needed for proper alignment

  // Totals Section with fixed positioning layout
  doc.moveDown(0.5).fontSize(8 * 1.2);

  // Render each line with the description and amount on the same line
  doc
    .text(`Total:`.padEnd(12), rightCenterX, doc.y, {
      width: 200,
      continued: true,
    })
    .text(`${totals.totalPrice}`, amountX, doc.y);

  doc.moveDown(0.15);
  doc
    .text(`Discount:`, rightCenterX, doc.y, { width: 200, continued: true })
    .text(`${totals.discount}`, amountX, doc.y);

  doc.moveDown(0.15);
  //   doc
  //     .text(`Subtotal:`, rightCenterX, doc.y, { width: 200, continued: true })
  //     .text(`${totals.subTotal}`, amountX, doc.y);

  //   doc.moveDown(0.15);

  doc
    .text(`Advance:`, rightCenterX, doc.y, { width: 200, continued: true })
    .text(`${totals.advPayment}`, amountX, doc.y);

  // Balance Section with consistent alignment
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.4);
  doc
    .text(`Balance:`, rightCenterX, doc.y, { width: 200, continued: true })
    .text(`${totals.balance}`, amountX, doc.y);
  // Move Down and Position the Final Message
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc
    .moveDown(0.7)
    .fontSize(7 * 1.2)
    .text("Thank you. Come Again....", doc.page.margins.left * 3, doc.y);
  doc
    .moveDown(0.15)
    .text("System Made by SharkDev.lk", doc.page.margins.left * 3, doc.y);

  doc.end();
};

export const buildRentPdf = (dataCallBack, endCallBack, data) => {
  const { customer, rentOrderDetails, totals, orderNo, store } = data;

  // Set the page size to 80mm width and a reasonable height
  const doc = new PDFDocument({
    size: [227, 500], // Width: 80mm, Height: Dynamic
    margins: { top: 10, bottom: 10, left: 20, right: 20 }, // Narrow margins
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  const address =
    store === "KE"
      ? "No.176 A, First Floor, Kegalle."
      : "607, Colombo Road, Ranwala, Kegalle.";
  const email =
    store === "KE" ? "kegalleron@gmail.com" : "rontailorsranwala@gmail.com";
  const phone =
    store === "KE"
      ? "077 887 6778 / 035 205 1600"
      : "071 405 1601 / 035 205 1601";

  // Header Section with scaling
  doc.fontSize(10 * 1.2).text("Ron Tailors", { align: "center" });
  doc.fontSize(8 * 1.2).text(address, { align: "center" });
  doc.fontSize(8 * 1.2).text(phone, { align: "center" });
  doc.fontSize(7 * 1.2).text(email, { align: "center" });
  doc.fontSize(7 * 1.2).text("www.rontailors.com", { align: "center" });

  doc.moveDown(0.5);
  doc.fontSize(10 * 1.2).text("RENT BILL", { align: "center" });
  doc.fontSize(8 * 1.2).text(`Order No: ${orderNo}`, { align: "center" });

  // Section Divider
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // Customer Details
  doc
    .moveDown(0.5)
    .fontSize(8 * 1.2)
    .text(`Customer Name: ${customer.name}`);
  doc.moveDown(0.15).text(`Mobile: ${customer.mobile}`);
  doc.moveDown(0.15).text(`Rent Date: ${customer.rentDate}`);
  doc.moveDown(0.15).text(`Return Date: ${customer.returnDate}`);

  doc.moveDown(1);

  // Order Details Table
  const tableData = {
    headers: ["Description", "Amount"],
    rows: rentOrderDetails.map((detail) => [
      formatDescriptionForRent(detail), // Adjust this function if needed
      detail.amount,
    ]),
  };

  doc.moveDown(0.3);
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8 * 1.2),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7 * 1.2),
    columnSpacing: 8,
    padding: 4,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    x: doc.page.margins.left,
  });

  // Totals Section with fixed positioning layout
  const rightCenterX = doc.page.width * 0.4;
  const amountX = rightCenterX + 10; // Adjust amountX as needed for proper alignment

  doc.moveDown(0.5).fontSize(8 * 1.2);

  // Render each line with the description and amount on the same line

  doc
    .text(`Total:`.padEnd(12), rightCenterX, doc.y, {
      width: 200,
      continued: true,
    })
    .text(`${totals.totalPrice}`, amountX, doc.y);

  doc.moveDown(0.15);
  doc
    .text(`Discount:`, rightCenterX, doc.y, { width: 200, continued: true })
    .text(`${totals.discount}`, amountX, doc.y);

  doc.moveDown(0.15);
  //   doc
  //     .text(`Subtotal:`, rightCenterX, doc.y, { width: 200, continued: true })
  //     .text(`${totals.subTotal}`, amountX, doc.y);

  //   doc.moveDown(0.15);
  doc
    .text(`Advance:`, rightCenterX, doc.y, { width: 200, continued: true })
    .text(`${totals.advPayment}`, amountX, doc.y);

  // Balance Section with consistent alignment
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.4);
  doc
    .text(`Balance:`, rightCenterX, doc.y, { width: 200, continued: true })
    .text(`${totals.balance}`, amountX, doc.y);

  // Move Down and Position the Final Message
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc
    .moveDown(0.7)
    .fontSize(7 * 1.2)
    .text("Thank you. Come Again....", doc.page.margins.left * 3, doc.y);
  doc
    .moveDown(0.15)
    .text("System Made by SharkDev.lk", doc.page.margins.left * 3, doc.y);

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

  // Loop through rentOrderDetails with reduced spacing and smaller font size
  rentOrderDetails.forEach((detail) => {
    // Add customer details with scaled-down font sizes
    doc.moveDown(0.2).fontSize(9).text(`Customer Name: ${customer.name}`);
    doc.moveDown(0.15).text(`Mobile: ${customer.mobile}`);
    doc.moveDown(0.5);

    doc.fontSize(10).font("Helvetica-Bold").text(`Rent No: ${orderNo}`);
    doc.moveDown(0.2);
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

    doc.moveDown(1);
    doc.fontSize(8).text(`Suit Type: ${customer.suitType}`);
    doc.moveDown(0.2);
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .text(`Rent Date: ${customer.rentDate}`);
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
  });
  doc.end();
};

export const buildReadyMadePdf = (dataCallBack, endCallBack, data) => {
  const { customer, orderDetails, totals, orderNo, store } = data;

  // Define the document with 80mm width, reduced margins, and scalable height
  const doc = new PDFDocument({
    size: [227, 400], // 80mm width, height is scalable to content
    margins: { top: 10, bottom: 10, left: 20, right: 20 },
  });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);


    const address =
    store === "KE"
      ? "No.176 A, First Floor, Kegalle."
      : "607, Colombo Road, Ranwala, Kegalle.";
  const email =
    store === "KE" ? "kegalleron@gmail.com" : "rontailorsranwala@gmail.com";
  const phone =
    store === "KE"
      ? "077 887 6778 / 035 205 1600"
      : "071 405 1601 / 035 205 1601";

  // Header Section with scaling
  doc.fontSize(10 * 1.2).text("Ron Tailors", { align: "center" });
  doc.fontSize(8 * 1.2).text(address, { align: "center" });
  doc.fontSize(8 * 1.2).text(phone, { align: "center" });
  doc.fontSize(7 * 1.2).text(email, { align: "center" });
  doc.fontSize(7 * 1.2).text("www.rontailors.com", { align: "center" });

  doc.moveDown(0.3);
  doc.fontSize(10 * 1.2).text("Ready Made Item Bill", { align: "center" });
  doc.fontSize(8 * 1.2).text(`Order No: ${orderNo}`, { align: "center" });

  // Section breaker
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  doc.moveDown(1);

  // Create table for order details with scaled font and spacing
  const tableData = {
    headers: ["Description and Items", "Amount"],
    rows: orderDetails.map((detail) => [detail.description, detail.amount]),
  };

  doc.moveDown(0.2);
  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8 * 1.2),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7 * 1.2),
    columnSpacing: 10,
    padding: 3,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right, // Full width of the page
    x: doc.page.margins.left, // Position the table within the left margin
  });

  let rightCenterX = doc.page.width * 0.4;
  const amountX = rightCenterX + 10; // Adjust amountX as needed for proper alignment

  //   doc.moveDown(0.3);
  doc
    .text(`Total:`.padEnd(12), rightCenterX, doc.y, {
      continued: true,
    })
    .text(`${totals.totalPrice}`, amountX, doc.y);

  // Section breaker
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc
    .moveDown(0.7)
    .fontSize(7 * 1.2)
    .text("Thank you. Come Again....", doc.page.margins.left * 3, doc.y);
  doc
    .moveDown(0.15)
    .text("System Made by SharkDev.lk", doc.page.margins.left * 3, doc.y);

  doc.end();
};

export const buildMeasurementPdf = (dataCallBack, endCallBack, measurement) => {
  const doc = new PDFDocument({ margin: 30 });

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
    .font("Helvetica-Bold")
    .text(`${orderId}  |  ${customer.name} |   ${itemType}`, {
      align: "left",
    });
  doc.moveDown(0.5);

  // Add measurements with filtered values and smaller font size
  doc.font("Helvetica").fontSize(12).text(measurements, { align: "left" });
  doc.moveDown(0.5);

  // Add style information
  doc.fontSize(12).text(`Style: ${style}`, { align: "left" });
  doc.moveDown(0.5);

  // Add remarks
  doc.fontSize(12).text(`Remarks: ${remarks}`, { align: "left" });
  doc.moveDown(0.5);

  // Add release date and necessary status
  const formattedReleaseDate = new Date(
    estimatedReleaseDate
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  doc.fontSize(12).text(`Release Date:    ${formattedReleaseDate}    `, {
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
export const buildRentOrderBookPdf = (
  dataCallBack,
  endCallBack,
  data,
  rentDate
) => {
  const doc = new PDFDocument({ margin: 30 });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`Rent Order Book for the Date ${rentDate}`, { align: "center" });

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(1);

  // Table for Order Details
  const tableData = {
    headers: ["Order No", "Name", "Mobile", "Rent Items"],
    rows: data.map((detail) => [
      detail.rentOrderId,
      detail.customer.name,
      detail.customer.mobile,
      formatRentOrderDataForBook(detail.rentOrderDetails),
    ]),
  };

  doc.table(tableData, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8 * 1.4),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(7 * 1.4),
    columnSpacing: 8,
    padding: 2,
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    x: doc.page.margins.left,
  });

  doc.end();
};
