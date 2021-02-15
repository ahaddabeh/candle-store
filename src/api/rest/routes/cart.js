const express = require("express");
const { ShoppingCartController } = require("../controllers");
const router = express.Router();

router.post("/checkout", ShoppingCartController.checkout);

module.exports = router;