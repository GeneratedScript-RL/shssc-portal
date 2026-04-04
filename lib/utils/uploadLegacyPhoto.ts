export async function uploadLegacyPhoto(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/roster/photos", {
    method: "POST",
    body: formData,
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Unable to upload image.");
  }

  return payload.url as string;
}
