import type { FC, FieldsetHTMLAttributes } from 'react'

import { Box } from '@mantine/core'

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement>

const Fieldset: FC<FieldsetProps> = (props) => {
  return (
    <Box
      component="fieldset"
      sx={{
        border: 'unset',
        margin: 'unset',
        padding: 'unset',
        marginInline: 'unset',
        paddingInline: 'unset',
      }}
      {...props}
    />
  )
}
export default Fieldset
