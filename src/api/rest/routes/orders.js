const express = require("express");
const { OrderController } = require("../controllers");
const router = express.Router();

router.get("/", OrderController.list);
router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.delete);
router.get("/:id", OrderController.getById);

module.exports = router;