const tesseract = require('node-tesseract-ocr');
const path = require('path');
const pdf = require('pdf-parse');
const fs = require('fs').promises;

export const createOCRService = () => {
  const processFile = async (filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    
    if (extension === '.pdf') {
        return processPDF(filePath);
      } else if (extension === '.png' || extension === '.jpg' || extension === '.jpeg' || extension === '.tiff') {
        return processImage(filePath);
      }
    throw new Error('Unsupported file type');
  };

  const processPDF = async (filePath) => {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  };

  const processImage = async (filePath) => {
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    };

    try {
      const text = await tesseract.recognize(filePath, config);
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw error;
    }
  };

  return {
    processFile
  };
};