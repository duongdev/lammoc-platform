import type { FC } from 'react'
import { useEffect, useRef } from 'react'

import {
  completeNavigationProgress,
  NavigationProgress,
  startNavigationProgress,
} from '@mantine/nprogress'
import { useTransition } from '@remix-run/react'
export type NProgressProps = {}

const NProgress: FC<NProgressProps> = () => {
  const { state } = useTransition()
  const loadingRef = useRef(false)

  useEffect(() => {
    if (state === 'loading' && !loadingRef.current) {
      startNavigationProgress()
      loadingRef.current = true
    }
    if (state === 'idle' && loadingRef.current) {
      completeNavigationProgress()
      loadingRef.current = false
    }
  }, [state])

  return <NavigationProgress autoReset={true} progressLabel="Loading Page" />
}

export default NProgress
