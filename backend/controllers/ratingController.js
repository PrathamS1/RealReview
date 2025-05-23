const { addRating, getImageRatings } = require("../services/ratingService");
const { AppError, RATING_ERRORS, handleDatabaseError, handleRatingError } = require("../errors/errorHandler");

//^ Controller to handle rating an image
const rateImage = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        if (!rating) {
            throw new AppError(RATING_ERRORS.INVALID_RATING);
        }

        const result = await addRating(id, rating);
        res.status(201).json({
            message: "Rating added successfully",
            rating: result.rating,
            averageRating: result.averageRating
        });
    } catch (error) {
        console.error("Error in rateImage controller:", error);
        if (error instanceof AppError) {
            return res.status(error.status).json({ error: error.message });
        }
        // database errors
        if (error.code) {
            const dbError = handleDatabaseError(error);
            return res.status(dbError.status).json({ error: dbError.message });
        }
        // other errors
        const ratingError = handleRatingError(error);
        return res.status(ratingError.status).json({ error: ratingError.message });
    }
};

//^ Controller to handle fetching ratings for an image
const getRatings = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await getImageRatings(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getRatings controller:", error);
        if (error instanceof AppError) {
            return res.status(error.status).json({ error: error.message });
        }
        // database errors
        if (error.code) {
            const dbError = handleDatabaseError(error);
            return res.status(dbError.status).json({ error: dbError.message });
        }
        // other errors
        const ratingError = handleRatingError(error);
        return res.status(ratingError.status).json({ error: ratingError.message });
    }
};

module.exports = {
    rateImage,
    getRatings
}; 