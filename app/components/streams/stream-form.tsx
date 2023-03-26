import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { SimpleGrid, Stack, Textarea, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { roundToNearestMinutes } from 'date-fns'
import { defaultsDeep } from 'lodash'
import type { UseFormReturn } from 'react-hook-form'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import StreamFormVariants from './stream-form-variants'

export const streamSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
  embedCode: z.string().trim().optional(),
  startsAt: z.date().min(new Date()).optional(),
  variants: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string(),
        name: z.string(),
        productName: z.string().optional(),
        quantity: z.number().int().default(1).optional(),
        images: z.array(z.string().url()).optional(),
      }),
    )
    .min(0)
    .default([]),
})

export type StreamFormValues = z.infer<typeof streamSchema>

export type StreamFormProps = {
  initialValues?: Partial<StreamFormValues>
  // eslint-disable-next-line no-unused-vars
  children: (props: {
    form: ReactNode
    methods: UseFormReturn<StreamFormValues>
  }) => ReactNode
}

const defaultValues: StreamFormValues = {
  title: '',
  description: '',
  embedCode: '',
  startsAt: roundToNearestMinutes(new Date(), {
    nearestTo: 15,
    roundingMethod: 'ceil',
  }),
  variants: [],
}

const StreamForm: FC<StreamFormProps> = ({ initialValues, children }) => {
  const methods = useForm<StreamFormValues>({
    resolver: zodResolver(streamSchema),
    defaultValues: defaultsDeep(initialValues, defaultValues),
  })

  const {
    register,
    formState: { errors },
    setValue,
    control,
  } = methods

  const form = useMemo(
    () => (
      <SimpleGrid cols={2}>
        <Stack>
          <TextInput
            autoFocus
            required
            error={errors.title?.message}
            label="Tiêu đề"
            {...register('title')}
          />
          <Textarea
            error={errors.description?.message}
            label="Mô tả"
            {...register('description')}
          />
          <Controller
            control={control}
            name="startsAt"
            render={({ field: { name, value }, fieldState: { error } }) => (
              <DateTimePicker
                error={error?.message}
                label="Bắt đầu"
                minDate={new Date()}
                name={name}
                onChange={(date) => setValue(name, date ?? undefined)}
                value={value}
              />
            )}
          />
          <Textarea
            error={errors.embedCode?.message}
            label="Mã nhúng restream"
            {...register('embedCode')}
          />
        </Stack>
        <StreamFormVariants />
      </SimpleGrid>
    ),
    [errors, register, setValue, control],
  )

  return <FormProvider {...methods}>{children({ form, methods })}</FormProvider>
}

export default StreamForm
