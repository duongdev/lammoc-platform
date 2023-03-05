import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { Carousel } from '@mantine/carousel'
import { AspectRatio, Box, Loader } from '@mantine/core'

import { LOYALTY_CARD_ASPECT_RATIO } from '~/config/app-config'
import type { LoyaltyMemberItem } from '~/routes/app+/account+'
import { useIsMobile } from '~/utils/hooks'

import LoyaltyMemberCard from './loyalty-member-card'

export type LoyaltyMembersProps = {
  members: LoyaltyMemberItem[]
}

const LoyaltyMembers: FC<LoyaltyMembersProps> = ({ members }) => {
  const [ready, setReady] = useState(false)

  const isMobile = useIsMobile()

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  if (!members.length) {
    return null
  }

  if (!ready) {
    return (
      <AspectRatio ratio={LOYALTY_CARD_ASPECT_RATIO}>
        <Box>
          <Loader size={40} />
        </Box>
      </AspectRatio>
    )
  }

  return (
    <Carousel
      align="start"
      draggable={isMobile || members.length > 2}
      slideGap="sm"
      styles={{ viewport: { overflow: 'visible' } }}
      withControls={false}
      breakpoints={[
        { minWidth: 315, slideSize: members.length > 2 ? '40%' : '50%' },
        {
          slideSize: '100%',
          slideGap: '0.25rem',
          maxWidth: 'xs',
        },
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
