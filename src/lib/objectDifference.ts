import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import {reduce} from "lodash";

export default function difference(origObj: any, newObj: any) {

  function flatten(obj: any, parentKey: string = "") {
    let arrayIndexCounter = 0
    return transform(obj, function (result: any, value: any, key: any) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key
      let resultKey = isArray(value) ? `${currentKey}.${arrayIndexCounter++}` : currentKey
      if (isObject(value)) {
        Object.assign(result, flatten(value, currentKey))
      } else {
        result[resultKey] = value
      }
    })
  }

  function onlyUnique(value: any, index: number, array: any[]) {
    return array.indexOf(value) === index;
  }

  const origObjFlattened = flatten(origObj)
  const newObjFlattened = flatten(newObj)

  return Object.keys(origObjFlattened)
    .concat(Object.keys(newObjFlattened))
    .filter(onlyUnique)
    .reduce((result: any, key: any) => {
      let newObjValue = newObjFlattened[key]
      if (!isEqual(origObjFlattened[key], newObjValue)) {
        result[key] = newObjValue || null
      }
      return result
    }, {})
}
