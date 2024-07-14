const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/api/addSubscriber", async (req, res) => {
  try {
    const response = await axios.post(
      "https://us22.api.mailchimp.com/3.0/lists/2d92e6abf1D/members",
      {
        email_address: req.body.email,
        status: "subscribed",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `apikey:${process.env.MAILCHIMP_API_KEY}`
          ).toString("base64")}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
