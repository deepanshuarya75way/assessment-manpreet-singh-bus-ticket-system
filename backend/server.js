require("dotenv").config();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const QRCode = require("qrcode");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({origin:"http://localhost:3000"}));
app.use(express.json());


// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

console.log("EMAIL:", process.env.EMAIL);
console.log("PASS:", process.env.PASS ? "Loaded ✅" : "Not Loaded ❌");

// Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

console.log("Transporter created 🚀");

// ❌ REMOVE verify (timeout issue deta hai)
// transporter.verify(...)

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  from: String,
  to: String,
  fare: Number,
  busNo: String,
  seatNumber: Number,
  time: Date
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// ✅ CREATE TICKET (FINAL FIX)
app.post("/create-ticket", async (req, res) => {
  try {
    const { from, to, fare, busNo,seatNumber } = req.body;

    if (!from || !to || !fare || !busNo || !seatNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const alreadyBooked = await Ticket.findOne({
      busNo,
      seatNumber
    });
    if(alreadyBooked){
      return res.status(400).json({
        error: "Seat already bookeddd..."
      })
    }
    const ticketId = "TKT" + Date.now();

    const newTicket = new Ticket({
      ticketId,
      from,
      to,
      fare,
      busNo,
      seatNumber,
      time: new Date()
    });

    await newTicket.save();

    // 🔥 NON-BLOCKING + TIMEOUT SAFE MAIL
    setTimeout(() => {
      transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: "🚌 New Ticket Generated",
        text: `
From: ${from}
To: ${to}
Fare: ₹${fare}
Bus No: ${busNo}
Time: ${new Date().toLocaleString()}
`
      })
      .then(() => console.log("Mail sent ✅"))
      .catch(err => console.log("Mail failed ❌:", err.message));
    }, 0);

    // ✅ FAST RESPONSE
    const qr = await QRCode.toDataURL(ticketId);

    return res.status(200).json({ ticketId, qr });

  } catch (error) {
    console.log("Create Ticket Error ❌:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// VERIFY API
app.get("/verify/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id });

    if (ticket) {
      return res.json({ status: "VALID", ticket });
    } else {
      return res.status(404).json({ status: "INVALID" });
    }

  } catch (error) {
    console.log("Verify Error ❌:", error.message);
    return res.status(500).json({ error: "Server Error" });
  }
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});