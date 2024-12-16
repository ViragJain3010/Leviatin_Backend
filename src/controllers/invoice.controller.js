import asyncHandler from "express-async-handler";
import puppeteer from "puppeteer";
import Product from "../models/product.model.js";

const generateInvoiceHTML = (products, user) => {
  const productsWithTotals = products.map((product) => {
    const plainProduct = product.toObject(); // Convert Mongoose object to plain JS object
    const total = plainProduct.price * plainProduct.quantity; // Calculate total price
    const gst = total * 0.18; // Calculate GST
    return {
      ...plainProduct,
      total,
      gst,
    };
  });

  // Calculate aggregate totals
  const totalAmount = productsWithTotals.reduce(
    (sum, product) => sum + product.total,
    0
  );
  const totalGST = productsWithTotals.reduce(
    (sum, product) => sum + product.gst,
    0
  );
  const grandTotal = totalAmount + totalGST;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice PDF</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }

        body {
          padding: 20px;
          background-color: #f9f9f9;
          color: #333;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          border: 1px solid #ddd;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
        }

        .header .title {
          font-size: 24px;
          font-weight: bold;
          color: #000;
        }

        .info {
          display: flex;
          justify-content: space-between;
          background-image: radial-gradient(circle, #0f0f0f, #1a1923, #222236, #2a2c4b, #303661);
          color: white;
          padding: 25px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .info .name {
          font-weight: 700;
          font-size: 18px;
          color: #CCF575;
        }

        .info .email {
          font-size: 14px;
          background: white;
          color: black;
          padding: 5px 10px;
          border-radius: 20px;
        }

        .info .date {
          font-size: 14px;
          text-align: right;
          color: #DDDDDD;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border-radius: 50%;
        }

        table thead {
          background-image: linear-gradient(to right, #303661, #003d5e, #003e46, #003b24, #263406);
          color: white;
          border-radius: 50%;
        }

        table th, table td {
          text-align: left;
          padding: 8px;
          border: none;
        }

        table tbody tr:nth-child(odd) {
          background-color: #FFF;
        }

        table tbody tr:nth-child(even) {
          background-color: #FAFAFA;
        }

        .summary {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        .summary .box {
          width: 250px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .summary p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .summary .total {
          font-weight: bold;
          font-size: 16px;
        }

        .footer {
          background-color: #272833;
          color: white;
          text-align: center;
          padding: 15px;
          font-size: 12px;
          border-radius: 50px;
          margin-top: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div>
            <img src="data:image/png;base64,
              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"
              alt="Company Logo" style="max-height: 50px;"
            >
          </div>
          <div class="title">INVOICE GENERATOR</div>
        </div>

        <!-- Info -->
        <div class="info">
          <div>
            <p style="color: #cccccc; margin-bottom: 10px">Name</p>
            <p class="name">${user.name}</p>
          </div>
          <div>
            <p class="date">Date: ${new Date().toLocaleDateString()}</p>
            <p class="email">${user.email || "No email provided"}</p>
          </div>
        </div>

        <!-- Table -->
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${productsWithTotals
              .map(
                (product) => `
              <tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>₹${product.total.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
          <div class="box">
            <p><span>Total Charges</span><span>₹${totalAmount.toFixed(
              2
            )}</span></p>
            <p><span>GST (18%)</span><span>₹${totalGST.toFixed(2)}</span></p>
            <p class="total"><span>Total Amount</span><span>₹${grandTotal.toFixed(
              2
            )}</span></p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateInvoice = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const user = req.user;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    // Generate HTML for the invoice
    console.log("Generating HTML for the invoice");
    const html = generateInvoiceHTML(products, user);

    await page.setContent(html);
    console.log("HTML content set successfully");

    // Generate PDF
    console.log("Generating PDF");
    const pdf = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${Date.now()}.pdf`
    );
    res.send(pdf);

    console.log("PDF sent successfully");
  } catch (error) {
    console.error("Error generating invoice:", error.message);
    console.error("Stack Trace:", error.stack);

    res.status(500).json({
      message: "Error generating invoice",
      error: error.message,
    });
  }
});
