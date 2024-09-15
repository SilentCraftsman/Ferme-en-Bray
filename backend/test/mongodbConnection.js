import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// URI de connexion depuis le fichier .env
const uri = process.env.MONGO_URI;

// Créer une instance MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    // Connexion au cluster
    await client.connect();
    console.log('Connecté avec succès à MongoDB');

    // Accéder à une base de données
    const database = client.db('shop'); // Nom de la base de données
    console.log('Base de données connectée : shop');

    // Accéder à une collection
    const ordersCollection = database.collection('orders'); // Nom de la collection
    console.log('Collection connectée : orders');

    // Exemple d'interaction avec la base de données
    await ordersCollection.insertOne({ name: 'Test Order', quantity: 1 });
    console.log('Document inséré avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
  } finally {
    // Assurer la fermeture de la connexion
    await client.close();
  }
}

// Exporter la fonction pour l'utiliser ailleurs dans l'application
export { connectToDatabase };
