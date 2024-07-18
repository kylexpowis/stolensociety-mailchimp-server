require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 7000;

const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(cors());
app.use(express.json());

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

app.get("/", (req, res) => {
  res.send("Mailchimp API is running");
});

app.post("/api/addSubscriber", async (req, res) => {
  const { email } = req.body;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const DATACENTER = process.env.MAILCHIMP_API_SERVER;
  const API_KEY = process.env.MAILCHIMP_API_KEY;

  try {
    const response = await axios.post(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        email_address: email,
        status: "subscribed",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
        },
      }
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error(
      "Mailchimp error response:",
      error.response ? error.response.data : error.message
    );
    res
      .status(400)
      .send(error.response ? error.response.data : { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

