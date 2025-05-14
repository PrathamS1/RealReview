const pool = require('../database/db');
const fs = require('fs');
const path = require('path');

const uploadImage = async (req, res) => {
    const { location, rating, submitted_by } = req.body;
    const filename = req.file;
    if(!filename) {
        return res.status(400).json({ error: 'No Image is uploaded' });
    }
    try{
        const result = await pool.query(
            'INSERT INTO images (filename, location, submitted_by, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [filename.filename, location, submitted_by, rating || null]
        );
        res.status(201).json({
            message: 'Image uploaded successfully',
            image: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
};

const getImages = async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM images ORDER BY timestamp DESC');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
};

const deleteImage = async (req, res) => {
    const { id } = req.params;
    try{
        const image = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
        if (image.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const filename = image.rows[0].filename;
        const filePath = path.join(__dirname, '../imageUploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ error: 'Failed to delete image file' });
            }
        });
        await pool.query('DELETE FROM images WHERE id = $1', [id]);
        res.status(200).json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
};

module.exports = {
    uploadImage,
    getImages,
    deleteImage
};