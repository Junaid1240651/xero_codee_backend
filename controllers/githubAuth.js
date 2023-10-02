require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { generateToken } = require("../jwt/jwtAuth"); // Import JWT functions
const cliendId = process.env.cliendId;
const cliendSecreat = process.env.cliendSecreat;
const userRagistation = require("../model/userRagistationSchema");

exports.exchangeGitHubCodeForAccessToken = async (req, res) => {
  const params =
    "?client_id=" +
    cliendId +
    "&client_secret=" +
    cliendSecreat +
    "&code=" +
    req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    });
};
exports.githubAuth = async (req, res) => {
  const authHeader = req.get("Authorization");

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    // Make a request to GitHub to get user data
    const githubResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!githubResponse.ok) {
      return res.status(githubResponse.status).json({
        message: "Failed to fetch user data from GitHub",
      });
    }

    const githubUserData = await githubResponse.json();

    // Make a separate request to fetch the user's email(s)
    const userMailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!userMailResponse.ok) {
      console.error("Error fetching user emails:", error);
      return res.status(userMailResponse.status).json({
        message: "Failed to fetch user emails from GitHub",
      });
    }

    const userMailData = await userMailResponse.json();
    const userEmails = userMailData.map((emailObject) => emailObject.email);

    // Split the name field into first name and last name if it contains two words
    const nameParts = githubUserData.name ? githubUserData.name.split(" ") : [];
    let firstName = "";
    let lastName = "";
    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length >= 2) {
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    // Check if the email exists in your MongoDB database
    const existingUser = await userRagistation.findOne({
      email: userEmails[0], // Assuming you're using the primary email
    });

    if (existingUser && existingUser.password !== "") {
      const userData = {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      };

      const token = generateToken(existingUser._id);

      res.status(200).json({
        userData,
        token,
      });
      // Use the newly created user as the existingUser
    } else if (!existingUser) {
      const newUser = new userRagistation({
        firstName,
        lastName,
        email: userEmails[0],
        password: "", // Set a default empty password for new users
      });

      await newUser.save();
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      };

      res.status(201).json({
        userData,
      });
    } else if (existingUser && existingUser.password === "") {
      const userData = {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      };

      res.status(201).json({
        userData,
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
