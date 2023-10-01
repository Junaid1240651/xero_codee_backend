const mongoose = require("mongoose");

mongoose
  .connect(process.env.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((error) => {
    console.error("Connection error:", error);
    process.exit(1);
  });
