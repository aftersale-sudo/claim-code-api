import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/claim-code", async (req, res) => {
  const { code, phone } = req.body;

  if (!code || !phone) {
    return res.status(400).json({ status: "error", message: "Data tidak lengkap" });
  }

  try {
    // Guna Environment Variable untuk Google Script URL
    const gsUrl = process.env.GS_URL;

    const response = await fetch(gsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, phone })
    });

    const text = await response.text();

    let jsonResp;
    try {
      jsonResp = JSON.parse(text);
    } catch (err) {
      jsonResp = { status: "error", message: "Invalid response from Google Script" };
    }

    res.json(jsonResp);
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
