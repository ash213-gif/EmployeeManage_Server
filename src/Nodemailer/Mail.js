const nodemailer = require("nodemailer");
require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.user,
//     pass: process.env.pass,
//   },
// });



// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

// Wrap in an async IIFE so we can use await.
exports.sendmail = async (name, email , otp)=> {
  try{
    const info = await transporter.sendMail({
    from: `Maddison FooKoch" ${process.env.user}`, // sender address
    to: email,
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: `<b>Hello world? ${email} ${otp}</b>`, // HTML body
  });

  // console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};