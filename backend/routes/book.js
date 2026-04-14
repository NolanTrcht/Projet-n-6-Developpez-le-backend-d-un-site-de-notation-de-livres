const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const booksCtrl = require("../controllers/book");

router.post("/books", auth, multer, booksCtrl.createBook);
router.put("/books/:id", auth, multer, booksCtrl.modifyBook);
router.get("/books", booksCtrl.getAllBooks);
router.get("/books/bestrating", booksCtrl.getBestBook);
router.get("/books/:id", booksCtrl.getOneBook);

module.exports = router;
