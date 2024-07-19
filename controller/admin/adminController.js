const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");

const allUserDetails = asyncHandler(async (req, res) => {
  // Fetch all users
  const users = await User.find();

  res.status(200).json({
    data: users,
    error: false,
    success: true,
    message: "User details",
  });
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userName, email, password, role } = req.body;

  try {
    // Fetch user by id
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "User not found" });
    }

    // Prepare updated fields
    const updates = {};
    if (userName) updates.userName = userName;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (role) updates.role = role;

    // Update and save the user
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({
      error: false,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

const deleteUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({
      error: true,
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

module.exports = { allUserDetails, updateUserDetails, deleteUserDetails };
