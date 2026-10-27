export function parseArtifactSlug(qrValue: string): string | null {
  try {
    const url = new URL(qrValue.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    const pathSegments = url.pathname.split("/").filter(Boolean);
    if (pathSegments.length < 2) {
      return null;
    }

    const artifactSegment = pathSegments[pathSegments.length - 2];
    const slug = pathSegments[pathSegments.length - 1];
    if (
      artifactSegment !== "artifacts" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)
    ) {
      return null;
    }

    return slug;
  } catch {
    return null;
  }
}
