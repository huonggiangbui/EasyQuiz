import firebase from 'firebase'

import 'firebase/firestore'
import 'firebase/auth'
import "firebase/storage"
import "firebase/functions"

const config = {
  apiKey: "AIzaSyCZFwloShafJTrIKdZ_VmyF0yj5nbzrV3w",
  authDomain: "easyquiz-64933.firebaseapp.com",
  databaseURL: "https://easyquiz-64933.firebaseio.com",
  projectId: "easyquiz-64933",
  storageBucket: "easyquiz-64933.appspot.com",
  messagingSenderId: "761641181277",
  appId: "1:761641181277:web:8883b63a274020ecad6db4",
  measurementId: "G-9HF6TH260R"
  // apiKey: process.env.REACT_APP_FB_KEY,
  // authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FB_DB_URL,
  // projectId: process.env.REACT_APP_FB_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FB_MESSAGE_ID,
  // appId: process.env.REACT_APP_FB_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

firebase.initializeApp(config)

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage();

export const convertSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
  return transformedCollection
}

export default auth