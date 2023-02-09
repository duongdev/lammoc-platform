import { ActionIcon, TextInput } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconPencil } from '@tabler/icons-react'

export default function LockedAuthPhoneInput({
  phone,
  editTo,
}: {
  phone: string
  editTo: string
}) {
  return (
    <TextInput
      autoFocus
      disabled
      required
      id="phone"
      label="Số điện thoại"
      name="phone"
      placeholder="Nhập SĐT mua hàng"
      value={phone}
      rightSection={
        <ActionIcon
          component={Link}
          sx={{ height: 26, width: 26 }}
          to={editTo}
          variant="light"
        >
          <IconPencil size={16} />
        </ActionIcon>
      }
    />
  )
}
