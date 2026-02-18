
const ContactMessage = require("../models/contactMessage");

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const contact = await ContactMessage.create({ name, email, phone, subject, message });

    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { submitContactMessage };
