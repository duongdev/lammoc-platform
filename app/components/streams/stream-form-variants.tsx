import type { FC } from 'react'

import { Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import EmptyState from '../empty-state'

import type { StreamFormValues } from './stream-form'

export type StreamFormVariantsProps = {}

const StreamFormVariants: FC<StreamFormVariantsProps> = () => {
  const { control } = useFormContext<StreamFormValues>()
  const { fields: variants } = useFieldArray({ control, name: 'variants' })

  return (
    <Stack>
      {variants.length === 0 && <EmptyState message="Chưa có sản phẩm nào" />}
      <Button leftIcon={<IconPlus size="1rem" />} variant="default">
        Thêm sản phẩm
      </Button>
    </Stack>
  )
}

export default StreamFormVariants
