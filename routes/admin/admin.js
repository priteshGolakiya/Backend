const express = require("express");
const {
  allUserDetails,
  updateUserDetails,
  deleteUserDetails,
} = require("../../controller/admin/adminController");
const router = express.Router();

router.get("/all-users", allUserDetails);
router.put("/update-user/:id", updateUserDetails);
router.delete("/delete-user/:id", deleteUserDetails);

module.exports = router;
