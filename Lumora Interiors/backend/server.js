const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// =================================
// MIDDLEWARE
// =================================

app.use(cors({ origin: true }));
app.use(express.json());

// =================================
// MONGODB DATABASE
// =================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });

// =================================
// EMAIL TRANSPORTER
// =================================



// =================================
// ENQUIRY MODEL
// =================================

const enquirySchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true
    }
);

const Enquiry = mongoose.model(
    "Enquiry",
    enquirySchema
);

// =================================
// CONTACT API
// =================================

app.post("/api/contact", async (req, res) => {

    console.log("Contact form request received!");

    try {

        const {
            name,
            email,
            phone,
            projectType,
            message
        } = req.body;

        // Required fields

        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });

        }

        // Email validation

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }

        // Save enquiry to MongoDB

        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            projectType,
            message
        });

        await newEnquiry.save();

        console.log("New enquiry saved to database!");

        // Respond immediately to the website

        res.status(200).json({
            success: true,
            message: "Enquiry received successfully!"
        });

        // Send email notification in background

        fetch("https://api.resend.com/emails", {
    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "Authorization":
            `Bearer ${process.env.RESEND_API_KEY}`
    },

    body: JSON.stringify({

        from: "onboarding@resend.dev",

        to: [process.env.EMAIL_USER],

        reply_to: email,

        subject:
            `New Lumora Enquiry from ${name}`,

        html: `
            <h2>New LUMORA Website Enquiry</h2>

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Phone:</strong>
            ${phone || "Not provided"}</p>

            <p><strong>Project Type:</strong>
            ${projectType || "Not specified"}</p>

            <hr>

            <p><strong>Message:</strong></p>

            <p>${message}</p>

            <hr>

            <p>This enquiry was submitted through the LUMORA website.</p>
        `
    })
})
.then(async (response) => {

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Resend email failed."
        );
    }

    console.log(
        "Email notification sent successfully!",
        result
    );

})
.catch((error) => {

    console.error(
        "Email notification failed:",
        error.message
    );

});

        return res.status(500).json({

            success: false,

            message:
                "Unable to process enquiry."

        });

    }

});

// =================================
// TEST ROUTE
// =================================

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.get("/", (req, res) => {

    res.send(
        "LUMORA backend is running successfully!"
    );

});

// =================================
// START SERVER
// =================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `LUMORA backend running on port ${PORT}`
        );

    }
);