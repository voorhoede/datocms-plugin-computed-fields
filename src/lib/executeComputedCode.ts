import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import getFieldValue from '../lib/getFieldValue'
const datocmsClient = require('datocms-client')

interface Variables {
  getUpload: (uploadId: string) => any
  getModel: (modelId: string) => any
  getFieldValue: (object: object, fieldName: string) => string
  changedField: string|undefined
  locale: string
  datoCmsPlugin: RenderFieldExtensionCtx
}

export default async function executeComputedCode(
  ctx: RenderFieldExtensionCtx,
  codeToExecute: string,
  changedField?: string
  ) {
  const datoClient = new datocmsClient.SiteClient(ctx.currentUserAccessToken)

  function getUpload(uploadId: string) {
    return datoClient.upload.find(uploadId)
  }

  function getModel(modelId: string) {
    return datoClient.items.find(modelId)
  }

  const variables: Variables = {
    getUpload: getUpload,
    getModel: getModel,
    getFieldValue: getFieldValue,
    changedField: changedField,
    locale: ctx.locale,
    datoCmsPlugin: ctx,
  }

  const functionArgs: any[] = Object.keys(ctx.formValues)

  const functionParams = functionArgs.reduce((acc, fieldName) => {
    const fieldValue: any = ctx.formValues[fieldName]
    acc.push(fieldValue)

    return acc
  }, [])

  Object.keys(variables).forEach((variable) => {
    functionArgs.push(variable)
    functionParams.push(variables[variable as keyof Variables])
  })

  const evaluatedFunction: string = `return (async function() {${codeToExecute}})()`
  functionArgs.push(evaluatedFunction)

  // eslint-disable-next-line no-new-func
  const codeValue = Function.apply(null, functionArgs)
  const executedCode = await codeValue.apply(null, functionParams)
  return executedCode
}