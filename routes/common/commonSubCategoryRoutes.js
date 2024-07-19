const express = require("express");
const router = express.Router();
const {
  getAllSubcategories,
  getSubcategoryById,
} = require("../../controller/common/subCategories/subCategoriesController.js");

router.get("/", getAllSubcategories);
router.get("/:id", getSubcategoryById);
module.exports = router;
