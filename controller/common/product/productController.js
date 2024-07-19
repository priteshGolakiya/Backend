const Product = require("../../../models/productModel");

// Utility function to populate product fields
const populateProduct = (query) => {
  return query
    .populate("category")
    .populate("subcategory")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email profilePic",
      },
    });
};

// Get paginated products without reviews
const getPaginatedProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt" } = req.query;

    const skip = (page - 1) * limit;

    let searchCriteria = {};

    const sortOptions = {};
    if (sort) {
      if (sort.startsWith("-")) {
        sortOptions[sort.substring(1)] = -1;
      } else {
        sortOptions[sort] = 1;
      }
    }

    const products = await Product.find(searchCriteria)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(searchCriteria);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error(`Error fetching paginated products: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch paginated products." });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await populateProduct(Product.find()).exec();
    const productsWithAverageRating = products.map((product) => {
      const productObj = product.toObject({ virtuals: true });
      return {
        ...productObj,
        averageRating: product.averageRating,
        reviews: productObj.reviews.map((review) => ({
          ...review,
          user: {
            name: review.user.name,
            email: review.user.email,
            image: review.user.profilePic,
          },
        })),
      };
    });
    res.status(200).json(productsWithAverageRating);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// Get a specific product
const getProductById = async (req, res) => {
  try {
    const product = await populateProduct(
      Product.findById(req.params.id)
    ).exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const productObj = product.toObject({ virtuals: true });
    res.status(200).json({
      ...productObj,
      averageRating: product.averageRating,
      reviews: productObj.reviews.map((review) => ({
        ...review,
        user: {
          name: review.user.name,
          email: review.user.email,
          image: review.user.profilePic,
        },
      })),
    });
  } catch (error) {
    console.error(`Error fetching product by ID: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch product." });
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      subcategory,
      minPrice,
      maxPrice,
      sort = "createdAt",
    } = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;

    let searchCriteria = {};
    if (q) {
      searchCriteria.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { "category.name": { $regex: q, $options: "i" } },
        { "subcategory.name": { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      searchCriteria["category.name"] = { $regex: category, $options: "i" };
    }

    if (subcategory) {
      searchCriteria["subcategory.name"] = {
        $regex: subcategory,
        $options: "i",
      };
    }

    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = Number(minPrice);
      if (maxPrice) searchCriteria.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    if (sort) {
      if (sort.startsWith("-")) {
        sortOptions[sort.substring(1)] = -1;
      } else {
        sortOptions[sort] = 1;
      }
    }

    const products = await Product.find(searchCriteria)
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(searchCriteria);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getPaginatedProducts,
};
