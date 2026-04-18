const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const booksCtrl = require("../controllers/book");

router.post("/books", auth, multer, booksCtrl.createBook);
router.get("/books", booksCtrl.getAllBooks);
router.get("/books/bestrating", booksCtrl.getBestBook);
router.put("/books/:id", auth, multer, booksCtrl.modifyBook);
router.get("/books/:id", booksCtrl.getOneBook);
router.delete("/books/:id",auth, multer, booksCtrl.deleteBook);
router.post("/books/:id/rating", auth, multer, booksCtrl.postRating)

module.exports = router;
