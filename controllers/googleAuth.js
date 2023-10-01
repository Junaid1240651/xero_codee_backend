const userRagistation = require("../model/userRagistationSchema");
const { generateToken } = require("../jwt/jwtAuth"); // Import JWT functions

exports.googleAuth = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Check if the user's Google email exists in MongoDB
    const existingUser = await userRagistation.findOne({ email });

    if (existingUser && existingUser.password !== "") {
      const userData = {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      };
      // User exists, generate and return a token for login
      const token = generateToken(existingUser._id);

      return res.status(200).json({
        message: "Login with Google successful",
        userData,
        token,
        isNewUser: false,
      });
    } else if (existingUser && existingUser.password === "") {
      const userData = {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      };
      return res.status(400).json({
        message: "Password is required to create a new account.",
        userData,
      });
    } else if (!existingUser) {
      // Check if a password is provided
      const newUser = new userRagistation({
        firstName,
        lastName,
        email,
        password: "", // Save the provided password
      });

      await newUser.save();
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      };

      return res.status(400).json({
        message: "Password is required to create a new account.",
        userData,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
