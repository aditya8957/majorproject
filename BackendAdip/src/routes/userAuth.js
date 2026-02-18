// routes/authRouter.js
const express = require('express');
const authRouter = express.Router();
const { register, login, logout, adminRegister, deleteProfile, googleLogin } = require('../controllers/userAuthent');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');
const profileRouter = require('./profileRoutes');

// Auth routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);
authRouter.post('/googleLogin', googleLogin);

// Check route (your existing one)
authRouter.get('/check', userMiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role: req.result.role,
    }

    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
});

// Mount profile routes under /profile
authRouter.use('/profile', profileRouter);

module.exports = authRouter;