const express = require("express");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload"); // ton fichier multer

const router = express.Router();

const outputDir = path.join(__dirname, "../images");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const filename = `img-${Date.now()}.webp`;

    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .toFormat("webp", { quality: 70 })
      .toFile(path.join(outputDir, filename));

    res.json({
      message: "Image compressée avec succès",
      file: `/images/${filename}`, // important pour accès frontend
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
