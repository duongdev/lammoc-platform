import Server, { Users } from 'node-appwrite'

export const awServer = new Server.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT ?? '')
  .setProject(process.env.APPWRITE_PROJECT ?? '')
  .setKey(process.env.APPWRITE_API_KEY ?? '')

export const awUsers = new Users(awServer)
