// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA3crsNutjaxA2AU_i2T9qNllsI0A7ctpU',
  authDomain: 'tlm-customer-portal.firebaseapp.com',
  projectId: 'tlm-customer-portal',
  storageBucket: 'tlm-customer-portal.appspot.com',
  messagingSenderId: '705371931256',
  appId: '1:705371931256:web:9cf3451eef6094c3d8638d',
  measurementId: 'G-W13837204J',
}

export const setupFirebase = () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  if (process.env.NODE_ENV === 'production') {
    getAnalytics(app)
  }

  return app
}

export const firebaseClient = setupFirebase()
