export const MAX_LIMIT = 100

export const getMaxTake = (take = 20) => {
  take = Math.floor(take)

  return Math.max(0, Math.min(take, MAX_LIMIT))
}
