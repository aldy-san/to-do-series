import firebase from 'firebase/compat/app'
import {getApp} from 'firebase/app'
import 'firebase/compat/auth'
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if(!firebase.apps.length){
    firebase.initializeApp(clientCredentials);
}
const auth = getAuth(getApp())
const db = getFirestore()
export {auth, db}
export default firebase