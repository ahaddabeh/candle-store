const express = require("express");
const { OrderController } = require("../controllers");
const router = express.Router();
const authenticateToken = require("../../middleware/auhenticateToken");

// router.get("/", OrderController.list);
router.get("/", authenticateToken, OrderController.list);
router.get("/:id", authenticateToken, OrderController.getById);
router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);

module.exports = router;