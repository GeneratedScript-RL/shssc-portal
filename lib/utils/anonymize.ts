export function anonymize<T extends Record<string, unknown>>(submission: T) {
  const clone = { ...submission };

  delete clone.submitter_id;
  delete clone.internal_notes;
  delete clone.created_by;
  delete clone.email;
  delete clone.full_name;
  delete clone.avatar_url;

  return clone;
}
