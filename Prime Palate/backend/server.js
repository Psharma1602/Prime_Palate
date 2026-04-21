const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoutes = require("./routes/payment");
require("dotenv").config();

const app = express();
const Food = require("./models/Food");
app.use(cors());
app.use(express.json());
app.use("/api", paymentRoutes);
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend is Running");
});
// Add Food
app.post("/add-food", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Foods
app.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});