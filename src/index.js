import { createEditor } from './components/code-editor'
import { SiteClient } from 'datocms-client'
import createOutput, { updateElementValue } from './components/create-output'

import './styles/_style.css'

window.DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer()

  const locale = plugin.locale
  const fieldType = plugin.field.attributes.field_type
  const code = plugin.parameters.instance.defaultFunction
  const datoClient = new SiteClient(plugin.parameters.global.apiToken)
  const main = document.createElement('main')
  document.body.appendChild(main)
  let editor

  if (plugin.parameters.instance.editFunction) {
    editor = createEditor(main, code, executeComputedCode)
  }

  initPlugin()

  createOutput(main, fieldType)

  async function executeComputedCode(changedField) {
    const codeToExecute = editor ? editor.getValue() : code

    if (changedField && codeToExecute.indexOf(changedField) === -1) {
      return
    }

    const evaluatedFunction = `return (async function() {${codeToExecute}})()`

    const functionArgs = Object.keys(plugin.fields).reduce((acc, field) => {
      const fieldName = plugin.fields[field].attributes.api_key

      if (fieldName !== plugin.fieldPath && acc.indexOf(fieldName) === -1) {
        acc.push(fieldName)
        return acc
      } else {
        return acc
      }
    }, [])

    const functionParams = functionArgs.reduce((acc, fieldName) => {
      const fieldValue = plugin.getFieldValue(fieldName)
      acc.push(fieldValue)

      return acc
    }, [])

    functionArgs.push('getUpload')
    functionArgs.push('getModel')
    functionArgs.push('changedField')
    functionArgs.push('locale')
    functionArgs.push(evaluatedFunction)
    functionParams.push(getUpload)
    functionParams.push(getModel)
    functionParams.push(changedField)
    functionParams.push(locale)

    const codeValue = Function.apply(null, functionArgs)
    const executedCode = await codeValue.apply(null, functionParams)
    saveComputedValue(executedCode)
  }

  function saveComputedValue(updatedFieldPath) {
    const updatedValue = updateElementValue(updatedFieldPath, fieldType)
    plugin.setFieldValue(plugin.fieldPath, updatedValue)
  }

  function getUpload(uploadId) {
    return datoClient.uploads.find(uploadId)
  }

  function getModel(modelId) {
    return datoClient.items.find(modelId)
  }

  function initPlugin() {
    executeComputedCode()

    Object.keys(plugin.fields).forEach((field) => {
      const fieldName = plugin.fields[field].attributes.api_key
      if (fieldName !== plugin.fieldPath) {
        plugin.addFieldChangeListener(fieldName, () => {
          executeComputedCode(fieldName)
        })
      }
    })
  }
})
