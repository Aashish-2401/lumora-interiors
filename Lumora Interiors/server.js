const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const PORT = 5000;


// =================================
// MIDDLEWARE
// =================================

app.use(cors({
    origin: true
}));

app.use(express.json());


// =================================
// DATABASE CONNECTION
// =================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });


// =================================
// EMAIL CONFIGURATION
// =================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    // Temporary local-development workaround.
    // We will remove this before production deployment.
    tls: {
        rejectUnauthorized: false
    }
});


// =================================
// ENQUIRY MODEL
// =================================

const enquirySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 150
    },

    phone: {
        type: String,
        trim: true,
        maxlength: 20
    },

    projectType: {
        type: String,
        trim: true,
        maxlength: 50
    },

    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 2000
    }

}, {
    timestamps: true
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);


// =================================
// CONTACT FORM API
// =================================

app.post("/api/contact", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            projectType,
            message
        } = req.body;


        // =================================
        // BASIC VALIDATION
        // =================================

        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });

        }


        // =================================
        // EMAIL VALIDATION
        // =================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }


        // =================================
        // SAVE ENQUIRY
        // =================================

        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            projectType,
            message
        });

        await newEnquiry.save();

        console.log("New enquiry saved to database!");


        // =================================
        // SEND EMAIL
        // =================================

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            replyTo: email,

            subject: `New Lumora Enquiry from ${name}`,

            text: `
New enquiry received from the LUMORA website.

--------------------------------

Name: ${name}

Email: ${email}

Phone: ${phone || "Not provided"}

Project Type: ${projectType || "Not specified"}

--------------------------------

Message:

${message}

--------------------------------

This enquiry was submitted through the LUMORA website.
            `
        });

        console.log("Email notification sent successfully!");


        // =================================
        // SUCCESS RESPONSE
        // =================================

        res.status(200).json({

            success: true,

            message: "Enquiry received successfully!"

        });


    } catch (error) {

        console.error(
            "Error processing enquiry:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "Unable to process enquiry."

        });

    }

});


// =================================
// TEST ROUTE
// =================================

app.get("/", (req, res) => {

    res.send(
        "LUMORA backend is running successfully!"
    );

});


// =================================
// START SERVER
// =================================

app.listen(PORT, () => {

    console.log(
        `LUMORA backend running on port ${PORT}`
    );

});