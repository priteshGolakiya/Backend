const express = require("express");
const router = express.Router();
const {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddressById,
  deleteAddressById,
} = require("../../controller/admin/address/addressController.js");

router.get("/", getAllAddress);
router.get("/:addressId", getAddressById);
router.post("/", createAddress);
router.put("/:addressId", updateAddressById);
router.delete("/:addressId", deleteAddressById);

module.exports = router;
