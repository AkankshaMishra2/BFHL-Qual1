require("dotenv").config();
const express = require("express");
const cors = require("cors");

const bfhlRoutes = require("./routes/bhflroutes");
const healthRoutes = require("./routes/healthroutes");
const errorHandler = require("./middleware/errormiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRoutes);
app.use("/health", healthRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
