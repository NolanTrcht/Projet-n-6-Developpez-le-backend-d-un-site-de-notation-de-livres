const sharp = require("sharp");
const path = require("path");

module.exports = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filename = `img-${Date.now()}.jpg`;

    await sharp(req.file.buffer)
      .rotate()
      .resize(800)
      .jpeg({ quality: 70 })
      .toFile(path.join("images", filename));

    // remplace le fichier multer
    req.file.filename = filename;

    next();
  } catch (err) {
    console.error("SHARP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
