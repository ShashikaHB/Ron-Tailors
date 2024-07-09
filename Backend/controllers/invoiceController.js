import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { buildPdf } from "../pdf/pdf-service/pdf-service.js";

export const getInvoice = asyncHandler(async (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
  });
  buildPdf(
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
});
