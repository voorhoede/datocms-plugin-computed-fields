/**
 * Tells whether a change at `changedPath` should recompute the field at `fieldPath`,
 * that is, whether the field's code mentions the changed field.
 * A field's own changes never count, so its own writes don't re-trigger it.
 */
export default function isDependencyChange(
  changedPath: string,
  fieldPath: string,
  code: string,
): boolean {
  const isOwnChange =
    changedPath === fieldPath || changedPath.startsWith(`${fieldPath}.`)
  if (isOwnChange) return false

  // Compare names at the field's own level: for a field at `blocks.0.slug`,
  // a change at `blocks.0.title.en` is a change to `title`.
  const fieldDepth = fieldPath.split('.').length - 1
  const changedFieldName = changedPath.split('.')[fieldDepth]

  return Boolean(changedFieldName) && code.includes(changedFieldName)
}
