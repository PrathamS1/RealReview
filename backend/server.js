require("dotenv").config();
const imageRoutes = require("./routes/imageRoutes");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(    
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/api/images", imageRoutes);
app.use("/imageUploads", express.static("imageUploads"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
