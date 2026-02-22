const express = require('express');
const router = express.Router();
const { getApplicationStatus } = require('../controllers/applicationStatus');

// Public route for tracking application status
router.get('/status', getApplicationStatus);

module.exports = router;