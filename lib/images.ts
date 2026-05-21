function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function parseUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function extractDriveFileId(rawUrl: string) {
  const parsed = parseUrl(rawUrl)
  if (!parsed) return ""

  const host = parsed.hostname.toLowerCase()
  if (host !== "drive.google.com" && !host.endsWith(".drive.google.com")) return ""

  const fromFilePath = /\/file\/d\/([a-zA-Z0-9_-]+)/.exec(parsed.pathname)?.[1]
  if (fromFilePath) return fromFilePath

  const fromQuery = parsed.searchParams.get("id")
  if (fromQuery) return fromQuery

  return ""
}

export function normalizeImageUrl(url: string) {
  const raw = text(url)
  if (!raw) return ""
  if (raw.startsWith("/")) return raw

  const driveFileId = extractDriveFileId(raw)
  if (driveFileId) {
    return `https://drive.google.com/uc?export=view&id=${driveFileId}`
  }

  return raw
}

export function isValidImageUrl(url: string) {
  const normalized = normalizeImageUrl(url)
  if (!normalized) return false
  if (normalized.startsWith("/")) return true

  const parsed = parseUrl(normalized)
  if (!parsed) return false
  return parsed.protocol === "https:" || parsed.protocol === "http:"
}

export function getProductCoverImage(product: Record<string, unknown> | null | undefined) {
  if (!product) return ""

  const candidates = [
    product.coverImageUrl,
    product.imageUrl,
    product.coverUrl,
    product.thumbnailUrl,
    product.thumbnail,
  ]

  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(text(candidate))
    if (isValidImageUrl(normalized)) return normalized
  }

  return ""
}
