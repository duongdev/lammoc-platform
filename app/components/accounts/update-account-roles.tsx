import type { FC, FormEvent } from 'react'
import { useEffect, useMemo, useState, useCallback } from 'react'

import type { ModalProps } from '@mantine/core'
import { Alert, Button, Checkbox, Modal, Stack } from '@mantine/core'
import type { Account } from '@prisma/client'
import { AccountRole } from '@prisma/client'
import { Form, useFetcher } from '@remix-run/react'
import { capitalize, isEmpty, isEqual } from 'lodash'
import SuperJSON from 'superjson'

import type { action } from '~/routes/api+/accounts+/update-roles.$accountId'

import Fieldset from '../fieldset'

export type UpdateAccountRolesProps = {
  accountId: string
  roles: AccountRole[]
  // eslint-disable-next-line no-unused-vars
  onUpdated?: (account: Account) => void
}

export const UpdateAccountRoles: FC<UpdateAccountRolesProps> = ({
  accountId,
  roles,
  onUpdated,
}) => {
  const [rolesValue, setRolesValue] = useState(roles)
  const fetcher = useFetcher<typeof action>()

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      fetcher.submit(
        { roles: rolesValue.join() },
        {
          method: 'put',
          action: `/api/accounts/update-roles/${accountId}`,
        },
      )
    },
    [accountId, fetcher, rolesValue],
  )

  const data = useMemo(
    () => fetcher.data?.json && SuperJSON.deserialize(fetcher.data),
    [fetcher.data],
  )

  useEffect(() => {
    if (fetcher.type === 'done' && data?.id) {
      onUpdated?.(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fetcher.type])

  return (
    <Form
      action={`/api/accounts/update-roles/${accountId}`}
      method="post"
      onSubmit={handleSubmit}
    >
      <Checkbox.Group defaultValue={roles} onChange={setRolesValue as any}>
        <Stack>
          <Fieldset disabled={fetcher.state !== 'idle'}>
            <Stack>
              {Object.values(AccountRole).map((role) => (
                <Checkbox
                  key={role}
                  label={capitalize(role)}
                  name="roles"
                  value={role}
                />
              ))}
            </Stack>
          </Fieldset>
          {data?.message && <Alert color="red">{data.message}</Alert>}

          <Button
            disabled={isEqual(roles, rolesValue) || isEmpty(rolesValue)}
            loading={fetcher.state !== 'idle'}
            type="submit"
          >
            Cập nhật
          </Button>
        </Stack>
      </Checkbox.Group>
    </Form>
  )
}

export const UpdateAccountRolesModal: FC<
  UpdateAccountRolesProps & ModalProps
> = ({ opened, onClose, accountId, roles, onUpdated }) => {
  return (
    <Modal onClose={onClose} opened={opened} title="Cập nhật phân quyền">
      <UpdateAccountRoles
        accountId={accountId}
        onUpdated={onUpdated}
        roles={roles}
      />
    </Modal>
  )
}
