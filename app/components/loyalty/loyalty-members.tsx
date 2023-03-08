import type { FC } from 'react'

import { SimpleGrid } from '@mantine/core'

import type { LoyaltyMemberItem } from '~/routes/app+/account+'

import LoyaltyMemberCard from './loyalty-member-card'

export type LoyaltyMembersProps = {
  members: LoyaltyMemberItem[]
}

const LoyaltyMembers: FC<LoyaltyMembersProps> = ({ members }) => {
  return (
    <SimpleGrid breakpoints={[{ minWidth: 675, cols: 2 }]} cols={1}>
      {members.map((member) => (
        <LoyaltyMemberCard key={member.id} member={member} />
      ))}
    </SimpleGrid>
  )
}

export default LoyaltyMembers
