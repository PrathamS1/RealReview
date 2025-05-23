const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {getAllImageData, uploadImage, deleteImageById, getImagesById} =require('../controllers/imageController');

//! Route to make image submission
router.post('/', upload.single('image'), uploadImage);

//! Route to get all images
router.get('/', getAllImageData);

//! Route to get image by ID
router.get('/:id', getImagesById);

//! Route to delete image
router.delete('/:id', deleteImageById);

module.exports = router;