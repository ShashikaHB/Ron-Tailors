import PDFDocument from "pdfkit-table";

export const buildPdf = (dataCallBack, endCallBack) => {
  const doc = new PDFDocument({ margin: 30, size: "A4" });

  doc.on("data", dataCallBack);
  doc.on("end", endCallBack);

  doc.text("Some text with an embedded font!", 100, 100);

  doc.end();
};
