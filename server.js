const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Middleware pour analyser le corps des requêtes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Chemin du fichier de commentaires
const commentsFilePath = path.join(__dirname, 'comments.txt');

// Charger les commentaires depuis le fichier texte
let comments = [];
const loadComments = () => {
  if (fs.existsSync(commentsFilePath)) {
    const data = fs.readFileSync(commentsFilePath, 'utf-8').trim();
    if (data) {
      comments = data.split('\n');
    }
  }
  console.log('Commentaires chargés:', comments);
};

// Sauvegarder les commentaires dans le fichier texte
const saveComment = (comment) => {
  fs.appendFileSync(commentsFilePath, comment + '\n');
  console.log('Commentaire sauvegardé:', comment);
};

// Endpoint pour récupérer les commentaires
app.get('/api/comments', (req, res) => {
  console.log('Requête GET reçue');
  res.json(comments.slice().reverse().slice(0, 10)); // Retourner les 10 derniers commentaires
});

// Endpoint pour ajouter un commentaire
app.post('/api/comments', (req, res) => {
  const { name, text } = req.body;
  const newComment = `${name}: ${text}`;
  console.log('Requête POST reçue:', name);
  comments.push(newComment);
  saveComment(newComment);
  res.status(201).json({ message: 'Commentaire ajouté avec succès.' });
});

// Servir la page de contact
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Endpoint pour traiter les soumissions du formulaire de contact
app.post('/contact', (req, res) => {
  const { nom, prenom, email, message } = req.body;

  // Configurer Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'taniceivenson01@gmail.com', // Utilisation de la variable d'environnement
      pass: 'cbec xzbx tlws jwem'  // Utilisation de la variable d'environnement
    }
  });

  const mailOptions = {
    from: email,
    to: 'taniceivenson01@gmail.com', // Utilisation de la variable d'environnement
    subject: `Nouveau message de ${nom} ${prenom}`,
    text: `Vous avez reçu un nouveau message de ${nom} ${prenom} (${email}):\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi de votre message.' });
    } else {
      console.log('Email envoyé:', info.response);
      res.status(200).json({ message: 'Votre message a été envoyé avec succès.' });
    }
  });
});

// Charger les commentaires au démarrage du serveur
loadComments();

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
