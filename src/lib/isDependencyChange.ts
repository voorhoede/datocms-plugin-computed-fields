/**
 * Tells whether a change at `modifiedFieldPath` should recompute the field at `fieldPath`.
 * Changes to the field itself never count, so a field's own write does not re-trigger it.
 */
export default function isDependencyChange(
  modifiedFieldPath: string,
  fieldPath: string,
  code: string,
): boolean {
  if (
    modifiedFieldPath === fieldPath ||
    modifiedFieldPath.startsWith(`${fieldPath}.`)
  ) {
    return false
  }

  const lastIndexOfDot = fieldPath.lastIndexOf('.')
  const parentPath =
    lastIndexOfDot > 0 ? fieldPath.slice(0, lastIndexOfDot) : ''
  const nameAtFieldLevel = modifiedFieldPath
    .split('.')
    .slice(parentPath.split('.').filter((s) => s).length)
    .shift()

  return Boolean(nameAtFieldLevel && code.includes(nameAtFieldLevel))
}
