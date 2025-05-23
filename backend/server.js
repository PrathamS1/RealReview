require("dotenv").config();
const imageRoutes = require("./routes/imageRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(    
  cors({
    // origin: "http://localhost:5173",
    origin: "https://realreviewfr.netlify.app/",
  })
);
app.use(express.json());
app.use("/api/images", imageRoutes);
app.use("/api/images", ratingRoutes);
app.use("/imageUploads", express.static("imageUploads"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
