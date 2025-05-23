class Rating {
    constructor(image_id, rating_value) {
        this.image_id = image_id;
        this.rating_value = rating_value;
        this.created_at = new Date();
    }
}

module.exports = Rating; 