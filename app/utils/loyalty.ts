export function getTierImageUrl(imagePath: string | null) {
  if (!imagePath) return null

  return `https://loyalty.sapocorp.net/api/images/${imagePath}`
}
