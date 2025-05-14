require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./database/db');
const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use('/api/images', require('./routes/image-route'))
app.use('/imageUploads', express.static('imageUploads'))

app.listen(PORT, () =>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
