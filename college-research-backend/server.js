const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./utils/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// ✅ CORRECT ROUTE MOUNTING
app.use("/api/auth", require("./routes/auth-routes"));
app.use("/api/research", require("./routes/research-routes"));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});