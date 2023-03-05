import type { FC } from 'react'

import { Carousel } from '@mantine/carousel'

import type { LoyaltyMemberItem } from '~/routes/app+/account+'
import { useIsMobile } from '~/utils/hooks'

import LoyaltyMemberCard from './loyalty-member-card'

export type LoyaltyMembersProps = {
  members: LoyaltyMemberItem[]
}

const LoyaltyMembers: FC<LoyaltyMembersProps> = ({ members }) => {
  const isMobile = useIsMobile()

  if (!members.length) {
    return null
  }

  return (
    <Carousel
      align="start"
      // draggable={isMobile || members.length > 2}
      slideGap="md"
      slidesToScroll={isMobile ? 1 : 2}
      styles={{ viewport: { overflow: 'visible' } }}
      withControls={false}
      breakpoints={[
        { minWidth: 315, slideSize: members.length > 2 ? '40%' : '50%' },
        { maxWidth: 'xs', slideSize: '100%', slideGap: '0.5rem' },
      ]}
    >
      {members.map((member) => (
        <Carousel.Slide key={member.id}>
          <LoyaltyMemberCard member={member} />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export default LoyaltyMembers
