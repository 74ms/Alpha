const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000;

// A simple reverse proxy that injects our custom client
app.use(async (req, res) => {
  try {
    // Fetch the original Territorial.io page
    const targetUrl = "https://territorial.io" + req.originalUrl;
    const response = await axios.get(targetUrl);
    let html = response.data;
    const $ = cheerio.load(html);

    // Inject our custom client code and UI by appending our index.html shell
    // (This assumes your index.html shell is served as a static file, or you can inject your
    // overlay HTML and link to your client.js hosted on your domain.)
    $("body").prepend(`<div id="customWrapper">
      <!-- Your custom UI from index.html will be here -->
      <iframe id="territoryFrame" src="https://territorial.io" style="width:100%; height:100%; border:0;"></iframe>
    </div>
    <script src="https://74ms.github.io/Alpha/client.js"></script>`);
    
    res.send($.html());
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).send("Error fetching page.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
