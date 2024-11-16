const admin = require('firebase-admin');
const fs = require('fs');

// Inicializa Firebase Admin SDK
const serviceAccount = require('./your-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportFirestoreData() {
  const collections = await db.listCollections(); // Obtiene todas las colecciones
  const data = {};

  for (const collection of collections) {
    const snapshot = await collection.get(); // Obtiene todos los documentos de la colección
    data[collection.id] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), // Extrae los datos del documento
    }));
  }

  // Guarda los datos en un archivo JSON
  fs.writeFileSync('firestore-data.json', JSON.stringify(data, null, 2));
  console.log('Datos exportados a firestore-data.json');
}

exportFirestoreData().catch(console.error);
