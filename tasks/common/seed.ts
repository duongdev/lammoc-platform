import { hash } from 'bcrypt'

import { PASSWORD_SALT } from '~/config/app-config'
import prisma from '~/libs/prisma.server'

const SUPER_USER_PHONE = '+84979477635'

const seed = async () => {
  const account = await prisma.account.findUnique({
    where: { phone: SUPER_USER_PHONE },
  })

  if (!account) {
    await prisma.account.create({
      data: {
        name: 'Dương Đỗ',
        password: await hash('123123123', PASSWORD_SALT),
        phone: '+84979477635',
        roles: ['DEVELOPER'],
        phoneVerified: true,
      },
    })
  }

  await prisma.account.update({
    where: { phone: '+84979477635' },
    data: {
      roles: { push: ['DEVELOPER'] },
      phoneVerified: true,
    },
  })
}

seed().then(() => console.log('Seed successfully'))
