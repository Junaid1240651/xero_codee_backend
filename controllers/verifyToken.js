exports.verifyToken = async (req, res) => {
  res.status(200).json({ message: "Token is valid" });
};
