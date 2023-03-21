import type { FC } from 'react'
import { useMemo } from 'react'

import type { ButtonProps } from '@mantine/core'
import {
  Button,
  Group,
  Image,
  MediaQuery,
  Modal,
  Stack,
  Tabs,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { Tenant } from '@prisma/client'
import { IconX } from '@tabler/icons-react'

import {
  PAYMENT_INFO_BUTTON_DEFAULT_LABEL,
  TENANT_BANK,
} from '~/utils/constants'
import { fVND } from '~/utils/format'

import TextInputCopy from './text-input-copy'

export type OrderInfo = {
  tenant: Tenant
  amount: number
  orderCode: string
}

export type PaymentInfoModalProps = {
  opened: boolean
  onClose: VoidFunction
  order: OrderInfo
}

export const PaymentInfoModal: FC<PaymentInfoModalProps> = ({
  onClose,
  opened,
  order,
}) => {
  const bank = useMemo(() => {
    return {
      ...TENANT_BANK[order.tenant],
      description: order.orderCode,
    }
  }, [order.orderCode, order.tenant])

  const qr = useMemo(() => {
    return `https://img.vietqr.io/image/vietcombank-${bank.accountNumber}-compact.jpg?amount=${order.amount}&addInfo=${bank.description}`
  }, [bank.accountNumber, bank.description, order.amount])

  return (
    <Modal
      onClose={onClose}
      opened={opened}
      size="xl"
      styles={{ body: { padding: '1rem 0' }, root: { width: '100%' } }}
      title={<Title order={4}>Thông tin thanh toán</Title>}
      withCloseButton={false}
    >
      <Tabs
        defaultValue="bank-transfer"
        styles={{ panel: { padding: '1rem' } }}
      >
        {/* <Tabs.List>
          <Tabs.Tab value="bank-transfer">Chuyển khoản</Tabs.Tab>
          <Tabs.Tab value="momo">Momo</Tabs.Tab>
        </Tabs.List> */}
        <Tabs.Panel value="bank-transfer">
          <Stack>
            <Group>
              <Stack sx={{ flexGrow: 1 }}>
                <TextInputCopy content={bank.bankName} label="Ngân hàng" />
                <TextInputCopy content={bank.brandName} label="Chi nhánh" />
                <TextInputCopy
                  content={bank.accountName}
                  label="Tên tài khoản"
                />
                <TextInputCopy
                  content={bank.accountNumber}
                  label="Số tài khoản"
                />
                <TextInputCopy
                  content={order.amount.toString()}
                  label="Số tiền"
                  value={fVND(order.amount)}
                />
                <TextInputCopy
                  content={bank.description}
                  label="Nội dung thanh toán"
                />
              </Stack>
              <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                <Image
                  src={qr}
                  styles={{ image: { width: '100% !important' } }}
                  width="60%"
                />
              </MediaQuery>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
      <Group mt="sm" position="right" px="1rem">
        <Button
          leftIcon={<IconX size="1rem" />}
          onClick={onClose}
          variant="default"
        >
          Đóng
        </Button>
        {/* <Button>Đã thanh toán</Button> */}
      </Group>
    </Modal>
  )
}

export type PaymentInfoButtonProps = {
  label?: string
  order: OrderInfo
} & ButtonProps

export const PaymentInfoButton: FC<PaymentInfoButtonProps> = ({
  label = PAYMENT_INFO_BUTTON_DEFAULT_LABEL,
  order,
  ...buttonProps
}) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Button onClick={open} {...buttonProps}>
        {label}
      </Button>
      <PaymentInfoModal onClose={close} opened={opened} order={order} />
    </>
  )
}
