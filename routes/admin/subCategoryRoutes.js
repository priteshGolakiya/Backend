const express = require("express");
const router = express.Router();
const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
  createAllSubcategories,
} = require("../../controller/admin/subCategory/subCategory");

router.post("/createAllSubcategories", createAllSubcategories);
router.get("/", getAllSubcategories);
router.get("/:id", getSubcategoryById);
router.post("/:categoryId", createSubcategory);
router.put("/:id", updateSubcategory);
router.delete("/:id", deleteSubcategory);

module.exports = router;
