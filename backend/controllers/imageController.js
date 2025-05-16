const {
  getImages,
  insertImage,
  deleteImage,
  getImageById,
} =require ("../services/imageService");

const getAllImageData = async (req, res) => {
  try {
    const images = await getImages();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

const uploadImage = async (req, res) => {
  try {
    const image = await insertImage(req);
    res.status(201).json({
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getImagesById=async(req, res) => {
    const { id } = req.params;
    try {
        const image = await getImageById(id);
        res.status(200).json(image);
    } catch (error) {
        console.error("Error fetching image by ID:", error.message);
        res.status(500).json({ error: error.message });
    }
}

const deleteImageById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedImage = await deleteImage(id);
    res.status(200).json({
      message: "Image deleted successfully",
      deletedImage, 
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

module.exports = {
    getAllImageData,
    uploadImage,
    deleteImageById,
    getImagesById
};
