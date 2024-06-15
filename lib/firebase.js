import admin from 'firebase-admin'
import { fireConfig } from './fireConfig'


try {
    admin.initializeApp({
        credential: admin.credential.cert(fireConfig),
    })
    console.log('Initialized.')
} catch (error) {
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack)
    }
}

const db = admin.firestore();

export { db };