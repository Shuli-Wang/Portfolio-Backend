require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MONGO_URI is not set in environment variables!");
    process.exit(1); // Stop the server if no DB connection is available
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
  });

// Define the number schema
const numberSchema = new mongoose.Schema({
    value: { type: Number, default: 0 }
});
const NumberModel = mongoose.model("Number", numberSchema);

// Add a root route to avoid "Cannot GET /" error
app.get("/", (req, res) => {
    res.send("Backend is running. Use /number or /increment.");
});

// API to get the current number
app.get("/number", async (req, res) => {
    try {
    let numberDoc = await NumberModel.findOne();
    if (!numberDoc) {
        numberDoc = await NumberModel.create({ value: 0 });
    }
    res.json({ value: numberDoc.value });
    } catch (error) {
        console.error("Error fetching number:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to increment the number
app.post("/increment", async (req, res) => {
    try {
    let numberDoc = await NumberModel.findOne();
    if (!numberDoc) {
        numberDoc = await NumberModel.create({ value: 0 });
    }
    numberDoc.value += 1;
    await numberDoc.save();
    res.json({ value: numberDoc.value });
    } catch (error) {
        console.error("Error incrementing number:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
