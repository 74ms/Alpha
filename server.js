const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000;

// Reverse proxy middleware to fetch Territorial.io and inject custom UI/script
app.use(async (req, res) => {
  try {
    // Build the target URL by appending the current request path to Territorial.io's base URL
    const targetUrl = `https://territorial.io${req.originalUrl}`;
    const { data: html } = await axios.get(targetUrl);

    // Load the fetched HTML into Cheerio for server-side DOM manipulation
    const $ = cheerio.load(html);

    // Inject custom client code and UI elements:
    // - A wrapper div containing an iframe to load Territorial.io content
    // - A script tag that references your custom client.js hosted on GitHub Pages
    $("body").prepend(`
      <div id="customWrapper">
        <!-- Custom UI container -->
        <iframe id="territoryFrame" src="https://territorial.io" style="width:100%; height:100%; border:0;"></iframe>
      </div>
      <script src="https://74ms.github.io/Alpha/client.js"></script>
    `);

    // Send the modified HTML to the client
    res.send($.html());
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).send("Error fetching page.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
