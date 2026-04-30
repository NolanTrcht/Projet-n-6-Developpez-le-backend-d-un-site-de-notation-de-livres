const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const upload = require("../middleware/upload");
const sharp = require("../middleware/sharp");
const booksCtrl = require("../controllers/book");

router.post("/", auth, upload.single("image"), sharp, booksCtrl.createBook);
router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksCtrl.getBestBook);
router.put("/:id", auth, upload.single("image"), sharp, booksCtrl.modifyBook);
router.get("/:id", booksCtrl.getOneBook);
router.delete("/:id", auth, multer, booksCtrl.deleteBook);
router.post("/:id/rating", auth, multer, booksCtrl.postRating);

module.exports = router;
