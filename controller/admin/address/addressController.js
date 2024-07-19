// controller/admin/address/addressController.js
const asyncHandler = require("express-async-handler");
const Address = require("../../../models/addressModel");

// Get all addresses
const getAllAddress = asyncHandler(async (req, res) => {
  try {
    const addresses = await Address.find().populate("user", "name email");
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get address by ID
const getAddressById = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  try {
    const address = await Address.findById(addressId).populate(
      "user",
      "name email"
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Create new address
const createAddress = asyncHandler(async (req, res) => {
  const { user, street, city, state, country, zipCode, isDefault } = req.body;
  try {
    const newAddress = new Address({
      user,
      street,
      city,
      state,
      country,
      zipCode,
      isDefault,
    });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Update address by ID
const updateAddressById = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { user, street, city, state, country, zipCode, isDefault } = req.body;
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { user, street, city, state, country, zipCode, isDefault },
      { new: true }
    ).populate("user", "name email");
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Delete address by ID
const deleteAddressById = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddressById,
  deleteAddressById,
};
