const express = require("express");
const { OrderController } = require("../controllers");
const router = express.Router();
const authenticateToken = require("../../middleware/auhenticateToken");

// router.get("/", OrderController.list);
router.get("/", authenticateToken, OrderController.list);
router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);
router.get("/:id", OrderController.getById);

module.exports = router;