import type { FC, ReactNode } from 'react'

import { ActionIcon, CopyButton, TextInput, Tooltip } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

export type TextInputCopyProps = {
  label: ReactNode
  content: string
  value?: string | number
}

const TextInputCopy: FC<TextInputCopyProps> = ({ content, label, value }) => {
  return (
    <TextInput
      readOnly
      label={label}
      value={value || content}
      rightSection={
        <CopyButton timeout={2000} value={content}>
          {({ copied, copy }) => (
            <Tooltip withArrow label={copied ? 'Đã copy' : 'Copy'}>
              <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      }
    />
  )
}

export default TextInputCopy
