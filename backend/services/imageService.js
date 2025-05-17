const fs = require("fs");
const path = require("path");
const {
  getAllImageData,
  insertImageData,
  getImagesById,
  deleteImageData,
} = require("../repository/imageRepo");
const Image = require("../models/imageModel");

//^ This function calls the repository function to get image data from the database
const getImages = async () => {
  try {
    const images = await getAllImageData();
    return images;
  } catch (err) {
    console.error("Error fetching images from image repo:", err);
    throw new Error("Failed to fetch images");
  }
};

//^ This function calls the repository function to get image data by ID from the database
const getImageById = async (id) => {
  try {
    const image = await getImagesById(id);
    if (!image) throw new Error("Image data not found");
    return image;
  } catch (err) {
    console.error("Error fetching image data by ID from image repo:", err);
    throw new Error("Failed to fetch image data by ID");
  }
};

//^ This function calls the repository function to insert image data into the database
const insertImage = async (req) => {
  const { location, rating, submitted_by } = req.body;
  const file = req.file;
  if (!file) {
    throw new Error("No image is uploaded");
  }
  const uniqueName = Date.now() + "-" + file.originalname;
  const imageInstance = new Image(
    uniqueName,
    location,
    submitted_by,
    rating
  );

  try {
    // const image = await insertImageData(
    //   uniqueName,
    //   location,
    //   submitted_by,
    //   rating || null
    // );
    const image = await insertImageData(imageInstance);
    const savePath = path.join(__dirname, "../imageUploads", uniqueName);
    fs.writeFileSync(savePath, file.buffer);
    return image;
  } catch (err) {
    console.error("Error inserting image in image repo:", err);
    throw new Error("Failed to insert image");
  }
};

//^ This function calls the repository function to delete image data by ID from the database
const deleteImage = async (id) => {
  try {
    const image = await getImagesById(id);
    if (!image) throw new Error("Image data not found");
    const file = image.filename;
    const filePath = path.join(__dirname, "../imageUploads", file);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        throw new Error("Failed to delete image file");
      }
    });
    const deletedImage = await deleteImageData(id);
    return deletedImage;
  } catch (err) {
    console.error("Error deleting image in image repo:", err);
    throw new Error("Failed to delete image");
  }
};

module.exports = {
  getImages,
  insertImage,
  deleteImage,
  getImageById,
};
