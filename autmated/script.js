const xlsx = require("xlsx");
const axios = require("axios");

// Path to your Excel file
const excelFilePath = "./kegalleStock.xlsx";

// Load the workbook
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
const sheet = workbook.Sheets[sheetName];

// Parse data from the sheet
const rentItems = xlsx.utils.sheet_to_json(sheet);

console.log(rentItems)

// Define the endpoint and token
const endpoint = "http://localhost:8000/api/v1/rentItem/?store=KE";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMiwiaWF0IjoxNzMwNjc2MDM3LCJleHAiOjE3MzA2ODIwMzd9.bvgL4WL4ET9C27_aP2u6imjkFe61A2FNUdg9dPIrQtw"; // Replace with your actual token

// Function to upload each rent item
const uploadRentItems = async () => {
  for (const item of rentItems) {
    try {
      const formattedBarcode = item.barcode.toString().padStart(4, "0");

      const response = await axios.post(
        endpoint,
        {
          rentItemId: `K${formattedBarcode}`,
          color: item.color,
          size: item.size,
          description: item.description,
          itemType: item.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT token to headers
          },
        }
      );
      console.log(`Uploaded: ${item.description} - ${response.data.message}`);
    } catch (error) {
      console.error(`Error uploading item: ${item.description}`, error.message);
    }
  }
};

// Execute the upload function
uploadRentItems()
  .then(() => {
    console.log("Upload complete");
  })
  .catch((error) => {
    console.error("An error occurred:", error.message);
  });
