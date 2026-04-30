const Book = require("../models/Book");
const fs = require("fs");

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
    res.status(500).json({ error });
  }
};

exports.createBook = (req, res) => {
  try {
    if (!req.body.book) {
      return res.status(400).json({ message: "Book manquant" });
    }
    const bookObject = JSON.parse(req.body.book);

    if (!req.file) {
      return res.status(400).json({ message: "Image manquante" });
    }

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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBestBook = async (req, res) => {
  try {
    const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteBook = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        console.log(filename);
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.modifyBook = async (req, res) => {
  let bookObject;

  try {
    // Verification du fichier //
    bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };
  } catch (error) {
    return res.status(400).json({ message: "Données invalides" });
  }

  // Vérification du titre //
  if (!bookObject.title || !bookObject.year || !bookObject.author || !bookObject.genre ) {
    return res.status(400).json({
      message: "Veuillez renseigner toutes les informations requises",
    });
  }

  // évite la modification de l'id du propiétaire //
  delete bookObject._userId;

  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérification que le userID est identique a celui de la requête //
    if (book.userId != req.auth.userId) {
      return res.status(403).json({ message: "Non Autorisé" });
    }

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id },
    );

    res.status(200).json({ message: "Objet modifié !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.postRating = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      const alreadyRating = book.ratings.find(
        (rating) => rating.userId === req.auth.userId,
      );

      if (alreadyRating) {
        return res.status(400).json({ message: "Non Autorisé" });
      }

      // Ajouter la note au tableau Ratings
      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating,
      });

      // Calcule la moyenne
      const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = sum / book.ratings.length;

      // Sauvegarder
      return book
        .save()
        .then((updatedBook) => {
          return res.status(200).json(updatedBook);
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
