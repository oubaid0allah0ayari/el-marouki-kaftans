const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');
const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload image and save to MongoDB
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    const image = new Image({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    const savedImage = await image.save();
    
    // Return relative URL pointing to the new DB image fetching route
    res.send({ url: `/api/upload/db/${savedImage._id}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading image to database' });
  }
});

// Fetch image directly from MongoDB
router.get('/db/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send({ message: 'Image not found in database' });
    }

    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching image' });
  }
});

module.exports = router;
