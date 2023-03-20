import type { FC } from 'react'
import { useEffect, useCallback } from 'react'

import { Group, SegmentedControl, Stack } from '@mantine/core'
import { Tenant } from '@prisma/client'
import type { LoaderArgs } from '@remix-run/node'
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from '@remix-run/react'

import PageTitle from '~/components/page-title'
import { redirect } from '~/utils/data'

export function loader({ request, params }: LoaderArgs) {
  if (!params.tenant) {
    return redirect(`./${Tenant.STORE_LAM_MOC}`)
  }

  return null
}

export type LoyaltyProps = {}

const Loyalty: FC<LoyaltyProps> = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { tenant } = params

  const handleTenantChange = useCallback(
    (tenant: Tenant) => {
      navigate(`./${tenant}`)
    },
    [navigate],
  )

  return (
    <Stack>
      <Group position="apart">
        <PageTitle>Lịch sử tích điểm</PageTitle>
        <SegmentedControl
          onChange={handleTenantChange}
          style={{ flexWrap: 'nowrap !important' as any }}
          value={tenant}
          data={[
            { label: 'Store Làm Mộc', value: Tenant.STORE_LAM_MOC },
            { label: 'Thích Tự Làm', value: Tenant.THICH_TU_LAM },
          ]}
          sx={(theme) => ({
            height: 42,
            border: 'solid 1px',
            borderColor: theme.colors.gray[4],
            '@media (max-width: 640px)': {
              width: '100%',
            },
          })}
        />
      </Group>

      <Outlet />
    </Stack>
  )
}

export default Loyalty
