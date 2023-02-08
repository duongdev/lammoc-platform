import { APP_NAME } from '~/config/app-config'

export const getTitle = (title: string) =>
  title ? `${title} – ${APP_NAME}` : APP_NAME
