require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Define the number schema
const numberSchema = new mongoose.Schema({
    value: { type: Number, default: 0 }
});
const NumberModel = mongoose.model("Number", numberSchema);

// API to get the current number
app.get("/number", async (req, res) => {
    let numberDoc = await NumberModel.findOne();
    if (!numberDoc) {
        numberDoc = await NumberModel.create({ value: 0 });
    }
    res.json({ value: numberDoc.value });
});

// API to increment the number
app.post("/increment", async (req, res) => {
    let numberDoc = await NumberModel.findOne();
    if (!numberDoc) {
        numberDoc = await NumberModel.create({ value: 0 });
    }
    numberDoc.value += 1;
    await numberDoc.save();
    res.json({ value: numberDoc.value });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
