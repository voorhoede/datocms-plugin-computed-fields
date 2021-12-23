import get from 'lodash/get'

export default function getFieldValue(object: object, fieldName: string): string {
  return String(get(object, fieldName))
}