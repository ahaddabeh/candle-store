const express = require("express");
const { ProductController } = require("../controllers");
const router = express.Router();

router.get("/", ProductController.list);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);
router.get("/:id", ProductController.getById);

module.exports = router;