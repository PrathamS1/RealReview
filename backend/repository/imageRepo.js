const pool=require('../database/db');

//* This function inserts image data into the database
const insertImageData=async(image)=>{
    const res=await pool.query(
        'insert into images (filename, location, submitted_by, rating) VALUES ($1, $2, $3, $4) RETURNING *',
        [image.filename, image.location, image.submitted_by, image.rating || null]
    );
    return res.rows[0];
}

//* This function retrieves all image data from the database
const getAllImageData=async()=>{
    const res=await pool.query(
        'select id, filename, location, submitted_by, rating from images order by timestamp desc'
    );
    return res.rows;
}

//* This function retrieves image data by ID from the database
const getImagesById=async(id)=>{
    const res=await pool.query(
        'select id, filename, location, submitted_by, rating from images where id=$1',
        [id]
    );
    return res.rows[0];
}

//* This function deletes image data by ID from the database
const deleteImageData=async(id)=>{
    const res=await pool.query(
        'delete from images where id=$1 returning id, filename, location, submitted_by, rating',
        [id]
    );
    return res.rows[0];
}

module.exports={
    insertImageData,
    getAllImageData,
    getImagesById,
    deleteImageData
}