require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 7000;
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(
  cors({
    origin: "https://stolen-society-signup.vercel.app", // actual frontend URL
    methods: ["GET", "POST"],
  })
);
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

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: "subscribed",
      }
    );

    res.status(200).send(response);
  } catch (error) {
    console.error(
      "Mailchimp error response:",
      error.response ? error.response.body : error.message
    );
    res
      .status(400)
      .send(error.response ? error.response.body : { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
