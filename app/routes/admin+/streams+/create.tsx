import type { FC } from 'react'

import { Alert, Button, Group, Stack } from '@mantine/core'
import { Form } from '@remix-run/react'

import PageTitle from '~/components/page-title'
import StreamForm from '~/components/streams/stream-form'

export type CreateStreamProps = {}

const CreateStream: FC<CreateStreamProps> = () => {
  return (
    <StreamForm>
      {({
        form,
        methods: {
          handleSubmit,
          formState: { isValid, submitCount, errors },
        },
      }) => (
        <Form onSubmit={handleSubmit(console.log)}>
          <Stack spacing="lg">
            <Group position="apart">
              <PageTitle>Tạo live stream mới</PageTitle>
              <Button disabled={!!submitCount && !isValid} type="submit">
                Lưu
              </Button>
            </Group>
            {errors.root?.message && (
              <Alert color="red">{errors.root.message}</Alert>
            )}
            {form}
          </Stack>
        </Form>
      )}
    </StreamForm>
  )
}

export default CreateStream
