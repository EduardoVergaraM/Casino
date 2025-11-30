const express = require("express");
const router = express.Router();
const authRouter = require('../auth')

require("./heartbeat")(router);

router.use('/auth', authRoutes);

module.exports = router;
