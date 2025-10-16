const apiBaseUrl = (import.meta.env.VITE_BIDX_API_URL || '').replace(/\/$/, '');

export function resolveFileUrl(url) {
  if (!url) return url ?? "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (!apiBaseUrl) {
    return url;
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
