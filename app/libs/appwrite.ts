import { Account, Client } from 'appwrite'

export const awClient = new Client()
  .setEndpoint('https://brains.withDustin.com/v1')
  .setProject('tlm-platform')

export const awAccount = new Account(awClient)
