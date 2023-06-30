import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

export default function difference(origObj: any, newObj: any) {
  function changes(newObj: any, origObj: any, parentKey: string = '', flattenResult: any = {}) {
    let arrayIndexCounter = 0

    transform(newObj, function (result: any, value: any, key: any) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key

      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? `${currentKey}.${arrayIndexCounter++}` : currentKey
        if (isObject(value) && isObject(origObj[key])) {
          changes(value, origObj[key], currentKey, flattenResult)
        } else {
          result[resultKey] = value
          flattenResult[resultKey] = value
        }
      }
    })

    return flattenResult
  }

  return changes(newObj, origObj)
}