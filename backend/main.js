import express, { json } from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { connect } from "mongoose";

import flow from "./models/flowDetails.js";
const app = express();

app.use(cors());
app.use(json());

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "MERN AI Flow App",
        },
      },
    );

    const result = response.data.choices[0].message.content;
    console.log(response.data);

    res.json({ answer: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.post("/api/save", async (req, res) => {
  const { prompt, response } = req.body;

  const data = new flow({
    prompt,
    response,
  });

  await data.save();

  res.json({ message: "Saved successfully" });
});

connect("mongodb://localhost:27017/aiFlow");

console.log("MongoDB connected");

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
