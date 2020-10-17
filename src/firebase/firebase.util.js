import firebase from 'firebase'

import 'firebase/firestore'
import 'firebase/auth'
import "firebase/storage"
import "firebase/functions"

const config = {
  apiKey: process.env.REACT_APP_FB_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DB_URL,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGE_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
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