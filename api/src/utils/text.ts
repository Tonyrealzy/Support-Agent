import mammoth from "mammoth";
import pdf from "pdf-parse";
import fs from "fs";
import path from "path";
import logger from "../config/logger";

const extractFromDocx = async (path: string) => {
  const buffer = fs.readFileSync(path);
  await mammoth
    .extractRawText({ buffer })
    .then((result) => {
      logger.info(result.value);
      return result.value;
    })
    .catch((error) => {
      logger.error("Error extracting from document: ", error);
    });
};

const extractFromPdf = async (path: string) => {
  const buffer = fs.readFileSync(path);
  await pdf(buffer)
    .then((data) => {
      logger.info(data.text);
      return data.text;
    })
    .catch((error) => {
      logger.error("Error extracting from document: ", error);
      return "";
    });
};

export const extractText = async (pathname: string, documentName: string) => {
  const ext = path.extname(documentName).toLowerCase();

  if (ext === ".pdf") {
    return await extractFromPdf(pathname);
  } else if (ext === ".docx") {
    return await extractFromDocx(pathname);
  } else {
    throw new Error("Unsupported file type");
  }
};
