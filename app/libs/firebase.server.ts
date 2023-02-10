import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: 'tlm-customer-portal',
      private_key_id: '54c0da645bacb30d25cc125a7ff17560c73cd3c6',
      private_key: process.env.FIREBASE_PRIVATE,
      client_email:
        'firebase-adminsdk-kgrcg@tlm-customer-portal.iam.gserviceaccount.com',
      client_id: '114829270815542477101',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kgrcg%40tlm-customer-portal.iam.gserviceaccount.com',
    } as any),
  })
}

export const firebaseAdmin = admin
