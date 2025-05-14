const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imagesController = require('../controllers/image');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'imageUploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

//! Route to make image submission
router.post('/', upload.single('image'), imagesController.uploadImage);

//! Route to get all images
router.get('/', imagesController.getImages);

//! Route to delete image
router.delete('/:id', imagesController.deleteImage);

module.exports = router;