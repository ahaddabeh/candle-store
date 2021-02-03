const express = require("express");
const { CategoryController } = require("../controllers");
const router = express.Router();

router.get("/", CategoryController.list);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);
router.get("/:id", CategoryController.getById);

module.exports = router;