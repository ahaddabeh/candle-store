const express = require("express");
const { CustomerController } = require("../controllers");
const router = express.Router();

router.get("/", CustomerController.list);
router.post("/", CustomerController.create);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.delete);
router.get("/:id", CustomerController.getById);

module.exports = router;