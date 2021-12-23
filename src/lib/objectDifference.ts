import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

export default function difference(origObj: any, newObj: any) {
  function changes(newObj: any, origObj: any) {
    let arrayIndexCounter = 0

    return transform(newObj, function (result: any, value: any, key: any) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
        result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
      }
    })
  }

  return changes(newObj, origObj)
}