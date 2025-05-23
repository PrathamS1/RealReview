const pool = require('../database/db');

//^ Query to insert a new rating and update the average rating in the images table
const insertRating = async (rating) => {
    const client = await pool.connect();
    try {
        // Using transactions to ensure data integrity
        await client.query('BEGIN');
        const insertQuery = `
            INSERT INTO ratings (image_id, rating_value, created_at)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const insertValues = [rating.image_id, rating.rating_value, rating.created_at];
        const insertResult = await client.query(insertQuery, insertValues);

        // Update the average rating in the images table
        const updateQuery = `
            UPDATE images 
            SET rating = (
                SELECT AVG(rating_value)::numeric(3,1)
                FROM ratings 
                WHERE image_id = $1
            )
            WHERE id = $1
        `;
        await client.query(updateQuery, [rating.image_id]);

        await client.query('COMMIT');
        return insertResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

//^ Query to get all ratings for a specific image
const getRatingsByImageId = async (imageId) => {
    const query = `
        SELECT id, image_id, rating_value, created_at
        FROM ratings
        WHERE image_id = $1
        ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [imageId]);
    return result.rows;
};

//^ Query to get the average rating for a specific image
const getAverageRatingByImageId = async (imageId) => {
    const query = `
        SELECT rating as average_rating
        FROM images
        WHERE id = $1
    `;
    const result = await pool.query(query, [imageId]);
    return result.rows[0]?.average_rating || 0;
};

module.exports = {
    insertRating,
    getRatingsByImageId,
    getAverageRatingByImageId
}; 