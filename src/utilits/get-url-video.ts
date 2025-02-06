export default function getSanityFileUrl(assetRef: string | undefined): string | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!assetRef || !projectId || !dataset) {
    console.error("Missing required parameters for Sanity file URL");
    return null;
  }

  const match = assetRef.match(/^file-(.+)-(.+)$/);
  if (!match) {
    console.error("Invalid asset reference format:", assetRef);
    return null;
  }

  const [, fileId, extension] = match;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.${extension}`;
}
