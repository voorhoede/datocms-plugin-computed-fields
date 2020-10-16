import codeEditor from './components/code-editor'
import { SiteClient } from 'datocms-client'

import './styles/_style.css'

window.DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer()

  const fieldPath = plugin.getFieldValue(plugin.fieldPath)
  let editor
  const code = plugin.parameters.instance.defaultFunction
  const client = new SiteClient(plugin.parameters.global.apiToken)

  Object.keys(plugin.fields).forEach((field) => {
    const fieldName = plugin.fields[field].attributes.api_key
    if (fieldName !== plugin.fieldPath) {
      plugin.addFieldChangeListener(fieldName, () => {
        executeComputedCode()
      })
    }
  })

  const main = document.createElement('main')
  document.body.appendChild(main)

  if (plugin.parameters.instance.editFunction) {
    const button = document.createElement('button')
    const codeSection = document.createElement('section')
    const codeMirrorContainer = document.createElement('div')

    codeSection.appendChild(codeMirrorContainer)
    codeSection.classList.add('code-section')
    codeSection.appendChild(button)

    button.classList.add('button')
    button.textContent = 'Execute code'
    button.addEventListener('click', () => {
      executeComputedCode()
    })

    main.appendChild(codeSection)
    editor = codeEditor(codeMirrorContainer, code)
  }

  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('readonly', true)
  input.value = fieldPath.value
  main.appendChild(input)
  executeComputedCode(code)

  async function executeComputedCode() {
    const codeToExecute = editor ? editor.getValue() : code
    const evaluatedFunction = `return (async function() {${codeToExecute}})()`

    const functionArgs = Object.keys(plugin.fields).reduce(
      (acc, field) => {
        const fieldName = plugin.fields[field].attributes.api_key

        if (fieldName !== plugin.fieldPath && acc.indexOf(fieldName) === -1) {
          acc.push(fieldName)
          return acc
        } else {
          return acc
        }
      }, [])

    const functionParams = functionArgs.reduce(
      (acc, fieldName) => {
        const fieldValue = plugin.getFieldValue(fieldName)
        acc.push(fieldValue)

        return acc
      }, [])

    functionArgs.push('getUpload')
    functionArgs.push('getModel')
    functionArgs.push(evaluatedFunction)
    functionParams.push(getUpload)
    functionParams.push(getModel)

    const codeValue = Function.apply(null, functionArgs)
    const executedCode = await codeValue.apply(null, functionParams)
    saveComputedValue(executedCode)
  }

  function saveComputedValue(updatedFieldPath) {
    input.value = updatedFieldPath
    plugin.setFieldValue(plugin.fieldPath, updatedFieldPath)
  }

  function getUpload(uploadId) {
    return client.uploads.find(uploadId)
  }

  function getModel(modelId) {
    return client.items.find(modelId)
  }
})
