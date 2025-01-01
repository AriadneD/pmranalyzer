const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Proxy route for Brave Search API
app.get("/api/brave-search", async (req, res) => {
  console.log("Brave API Key from env:", process.env.BRAVE_API_KEY);
  const { query } = req.query;
  try {
    const braveResponse = await axios.get(
      `https://api.search.brave.com/res/v1/web/search`,
      {
        params: { q: query, count: 5 },
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": process.env.BRAVE_API_KEY,
        },
      }
    );
    res.json(braveResponse.data);
  } catch (error) {
    console.error("Error in Brave Search API call:", error.message);
    res.status(500).send("Failed to fetch data from Brave Search API.");
  }
});

app.listen(PORT, () =>
  console.log(`Proxy server is running on http://localhost:${PORT}`)
);
