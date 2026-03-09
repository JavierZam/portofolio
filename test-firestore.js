import 'dotenv/config'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Fetching guestbook entries...");
  try {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    console.log(`Found ${snapshot.docs.length} documents.`);
    snapshot.forEach(doc => {
      console.log(`- ID: ${doc.id}`);
      console.log(`  Data:`, doc.data());
    });
  } catch (e) {
    console.error("Error fetching:", e);
  }
  process.exit();
}
run();
