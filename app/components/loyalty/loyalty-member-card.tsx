import type { FC } from 'react'
import { useState, useEffect, useMemo } from 'react'

import {
  AspectRatio,
  Box,
  Card,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconAward, IconWallet } from '@tabler/icons-react'
import { useBarcode } from 'next-barcode'
import numeral from 'numeral'

import {
  LOGO_URL,
  LOYALTY_CARD_ASPECT_RATIO,
  TENANT_COLOR,
} from '~/config/app-config'
import type { LoyaltyMemberItem } from '~/routes/app+/account+'
import { fVND, fPhone } from '~/utils/format'
import { getTierImageUrl } from '~/utils/loyalty'

export type LoyaltyMemberCardProps = {
  member: LoyaltyMemberItem
}

const LoyaltyMemberCard: FC<LoyaltyMemberCardProps> = ({ member }) => {
  const { inputRef: barcodeRef } = useBarcode({
    value: fPhone(member.phone),
    options: {
      displayValue: false,
      lineColor: 'rgba(0, 0, 0, 0.8)',
    },
  })
  const [barcodeImg, setBarcodeImg] = useState<any>()

  useEffect(() => {
    if (barcodeRef.current) {
      setBarcodeImg(barcodeRef.current.getAttribute('src'))
    }
  }, [barcodeRef])

  const logoImage = useMemo(() => {
    if (member.tenant === 'STORE_LAM_MOC') {
      return <Image height={26} src={LOGO_URL.STORE_LAM_MOC} width="auto" />
    }

    return <Image height={24} src={LOGO_URL.THICH_TU_LAM} width="auto" />
  }, [member.tenant])

  return (
    <AspectRatio miw={315} ratio={LOYALTY_CARD_ASPECT_RATIO}>
      <Box>
        <Card
          h="100%"
          radius="lg"
          w="100%"
          sx={{
            backgroundColor: TENANT_COLOR[member.tenant],
            color: 'black',
            cursor: 'default',
          }}
        >
          <Stack h="100%">
            <Group position="apart">
              <Group spacing="xs">
                <Image
                  placeholder
                  src={getTierImageUrl(member.tier.imageUrl)}
                  width={40}
                  styles={{
                    root: { borderRadius: '0.5rem', overflow: 'hidden' },
                  }}
                />
                <Title order={4}>{member.tier.name}</Title>
              </Group>
              <Center
                sx={{
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  padding: '0.5rem',
                  background: '#fff',
                  height: 40,
                }}
              >
                {logoImage}
              </Center>
            </Group>
            <Center
              sx={{
                flexGrow: 1,
                overflow: 'hidden',
              }}
            >
              <img
                alt={member.phone}
                ref={barcodeRef}
                style={{
                  width: '100%',
                  maxHeight: 80,
                  display: 'none',
                }}
              />
              {barcodeImg && (
                <img
                  alt={fPhone(member.phone)}
                  src={barcodeImg}
                  style={{
                    maxHeight: 64,
                    width: '100%',
                    height: '100%',
                    borderRadius: '0.5rem',
                  }}
                />
              )}
            </Center>
            <Group noWrap align="flex-end" position="apart">
              <Box sx={{ flexShrink: 0, maxWidth: '50%' }}>
                <Group noWrap spacing="xs">
                  <IconAward size="1rem" style={{ flexShrink: 0 }} />
                  <Text lineClamp={1} size="sm">
                    {numeral(member.points).format('0,0.00')} điểm
                  </Text>
                </Group>
                <Group noWrap spacing="xs">
                  <IconWallet size="1rem" style={{ flexShrink: 0 }} />
                  <Text lineClamp={1} size="sm">
                    {fVND(member.totalSpent)}
                  </Text>
                </Group>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Title lineClamp={1} order={5}>
                  {member.customer.name}
                </Title>
                <Text size="sm">{fPhone(member.phone)}</Text>
              </Box>
            </Group>
          </Stack>
        </Card>
      </Box>
    </AspectRatio>
  )
}

export default LoyaltyMemberCard
