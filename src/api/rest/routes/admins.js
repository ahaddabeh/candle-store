const express = require("express");
const { AdminController } = require("../controllers");
const router = express.Router();

router.post("/", AdminController.create);
// router.get("/", AdminController.list);
// router.put("/:id", AdminController.update);
// router.delete("/:id", AdminController.delete);
// router.get("/:id", AdminController.getById);

module.exports = router;