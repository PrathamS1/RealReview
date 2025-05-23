class Image{
    constructor(filename, location, submitted_by, rating = null) {
        this.filename = filename;
        this.location = location;
        this.submitted_by = submitted_by;
        this.rating = rating;
    }
}

module.exports = Image;