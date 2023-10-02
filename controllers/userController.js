const bcrypt = require("bcrypt"); // Import bcrypt
const { generateToken } = require("../jwt/jwtAuth"); // Import JWT functions
const userRagistation = require("../model/userRagistationSchema");
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await userRagistation.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password using the middleware
    const hashedPassword = await hashPassword(password);

    // Create a new user document
    const newUser = new userRagistation({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save the user document to MongoDB
    await newUser.save();
    const userData = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    };

    // Generate a JWT token for the new user
    const token = generateToken(newUser._id);

    res.status(201).json({ message: "Signup successful", userData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await userRagistation.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password Not Match" });
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken(user._id);

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(200).json({ message: "Login successful", userData, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    // Check if the user's email exists in the database
    const user = await userRagistation.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set the password for the user
    user.password = hashedPassword;
    await user.save();
    const token = generateToken(user._id);

    return res
      .status(200)
      .json({ message: "Password set successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
