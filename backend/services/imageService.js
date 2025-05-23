const fs = require("fs");
const path = require("path");
const {
  getAllImageData,
  insertImageData,
  getImagesById,
  deleteImageData,
} = require("../repository/imageRepo");
const Image = require("../models/imageModel");
const { AppError, IMAGE_ERRORS, handleDatabaseError, handleImageError } = require("../errors/errorHandler");

//^ This function calls the repository function to get image data from the database
const getImages = async () => {
  try {
    const images = await getAllImageData();
    return images.map(image => {
      const imageObj = new Image(
        image.filename,
        image.location,
        image.submitted_by,
        image.rating
      );
      imageObj.id = image.id;
      imageObj.timestamp = image.timestamp;
      return imageObj;
    });
  } catch (error) {
    console.error("Error fetching images from image repo:", error);
    if (error instanceof AppError) {
      throw error;
    }
    // database errors
    if (error.code) {
      throw handleDatabaseError(error);
    }
    // other errors
    throw handleImageError(error);
  }
};

//^ This function calls the repository function to get image data by ID from the database
const getImageById = async (id) => {
  try {
    const image = await getImagesById(id);
    if (!image) {
      throw new AppError(IMAGE_ERRORS.NOT_FOUND);
    }
    
    const imageObj = new Image(
      image.filename,
      image.location,
      image.submitted_by,
      image.rating
    );
    imageObj.id = image.id;
    imageObj.timestamp = image.timestamp;
    return imageObj;
  } catch (error) {
    console.error("Error fetching image data by ID from image repo:", error);
    if (error instanceof AppError) {
      throw error;
    }
    // database errors
    if (error.code) {
      throw handleDatabaseError(error);
    }
    // other errors
    throw handleImageError(error);
  }
};

//^ This function calls the repository function to insert image data into the database
const insertImage = async (req) => {
  const { location, rating, submitted_by } = req.body;
  const file = req.file;
  if (!file) {
    throw new AppError(IMAGE_ERRORS.NO_FILE);
  }

  const uniqueName = Date.now() + "-" + file.originalname;
  const imageInstance = new Image(
    uniqueName,
    location,
    submitted_by,
    rating
  );

  try {
    const image = await insertImageData(imageInstance);
    const savePath = path.join(__dirname, "../imageUploads", uniqueName);
    fs.writeFileSync(savePath, file.buffer);

    const imageObj = new Image(
      image.filename,
      image.location,
      image.submitted_by,
      image.rating
    );
    imageObj.id = image.id;
    imageObj.timestamp = image.timestamp;
    return imageObj;
  } catch (error) {
    console.error("Error inserting image in image repo:", error);
    const savePath = path.join(__dirname, "../imageUploads", uniqueName);
    if (fs.existsSync(savePath)) {
      fs.unlinkSync(savePath);
    }
    if (error instanceof AppError) {
      throw error;
    }
    // database errors
    if (error.code) {
      throw handleDatabaseError(error);
    }
    // other errors
    throw handleImageError(error);
  }
};

//^ This function calls the repository function to delete image data by ID from the database
const deleteImage = async (id) => {
  try {
    const image = await getImagesById(id);
    if (!image) {
      throw new AppError(IMAGE_ERRORS.NOT_FOUND);
    }

    const imageObj = new Image(
      image.filename,
      image.location,
      image.submitted_by,
      image.rating
    );
    imageObj.id = image.id;
    imageObj.timestamp = image.timestamp;

    const file = image.filename;
    const filePath = path.join(__dirname, "../imageUploads", file);
    
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new AppError(IMAGE_ERRORS.FILE_DELETE_FAILED);
    }

    await deleteImageData(id);
    return imageObj;
  } catch (error) {
    console.error("Error deleting image in image repo:", error);
    if (error instanceof AppError) {
      throw error;
    }
    // database errors
    if (error.code) {
      throw handleDatabaseError(error);
    }
    // other errors
    throw handleImageError(error);
  }
};

module.exports = {
  getImages,
  insertImage,
  deleteImage,
  getImageById,
};
