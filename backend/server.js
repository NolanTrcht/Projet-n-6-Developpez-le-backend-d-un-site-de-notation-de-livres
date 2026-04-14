const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/monprojet")
  .then(() => {
    console.log("Connexion à MongoDB réussie !");

    const port = process.env.PORT || 4000;
    const server = http.createServer(app);

    server.listen(port, () => {
      console.log("Serveur lancé sur le port " + port);
    });
  })
  .catch((error) => {
    console.error("Connexion à MongoDB échouée !", error);
  });
