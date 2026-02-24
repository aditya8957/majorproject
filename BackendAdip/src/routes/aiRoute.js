const express = require('express');
const aiRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const { assistAi, assistAiNonStreaming, testGemini } = require('../controllers/assistAi');

aiRouter.post('/assist', userMiddleware, assistAi);

aiRouter.post('/assist-non-streaming', userMiddleware, assistAiNonStreaming);

aiRouter.post('/public-assist', assistAi);

aiRouter.get('/test', testGemini);
aiRouter.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Divyang Sahayak AI service is running" 
    });
});

module.exports = aiRouter;