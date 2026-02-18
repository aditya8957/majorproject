
const express = require('express');
const router = express.Router();
const { getApplicationStatus } = require('../controllers/applicationStatus');
// const { getMyHistory } = require("../controllers/historyController");
const userMiddleware = require("../middleware/userMiddleware");


// router.get("/history",getMyHistory);

router.get('/status', getApplicationStatus);

module.exports = router;
