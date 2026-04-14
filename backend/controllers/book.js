const Book = require("../models/Book");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des livres",
      error,
    });
  }
};

exports.getOneBook = async (req, res) => {
  try {
    Book.findOne({ _id: req.params.id })
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(404).json({ message: { error } }));
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du livre",
      error,
    });
  }
};

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  
  delete bookObject._id;
  delete bookObject._user;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre ajouté" }))
    .catch((error) => res.status(500).json({ error }));
};

exports.getBestBook = async (req, res) => {
  try {
    const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifyBook = async (req, res) => {



};
