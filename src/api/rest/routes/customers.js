const express = require("express");
const { CustomerController } = require("../controllers");
const router = express.Router();
const authenticateToken = require("../../middleware/auhenticateToken");

router.get("/", authenticateToken, CustomerController.list);
router.post("/", CustomerController.create);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.delete);
router.get("/:id", authenticateToken, CustomerController.getById);

module.exports = router;