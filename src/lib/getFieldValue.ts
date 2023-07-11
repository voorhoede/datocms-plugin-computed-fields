import get from 'lodash/get'

export default function getFieldValue(object: object, fieldName: string): any {
  return get(object, fieldName)
}
