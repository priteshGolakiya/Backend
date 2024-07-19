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
router.get("/subcategory", getAllSubcategories);
router.get("/subcategory/:id", getSubcategoryById);
router.post("/subcategory/:categoryId", createSubcategory);
router.put("/subcategory/:id", updateSubcategory);
router.delete("/subcategory/:id", deleteSubcategory);

module.exports = router;
