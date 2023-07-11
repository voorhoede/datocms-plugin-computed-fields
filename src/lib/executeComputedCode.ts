import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import getFieldValue from '../lib/getFieldValue'
import { buildClient } from '@datocms/cma-client-browser'

interface Variables {
  getUpload: (uploadId: string) => any
  getModel: (modelId: string) => any
  getFieldValue: (object: object, fieldName: string) => any
  changedField: string | undefined
  locale: string
  datoCmsPlugin: RenderFieldExtensionCtx
  thisBlock: any
}

export default async function executeComputedCode(
  ctx: RenderFieldExtensionCtx,
  codeToExecute: string,
  changedField?: string,
) {
  let datoClient: any
  const accessTokenError: string =
    'You need to give the plugin permission to use an access token'

  const { currentUserAccessToken, environment } = ctx
  if (currentUserAccessToken) {
    datoClient = buildClient({ apiToken: currentUserAccessToken, environment })
  }

  function getUpload(uploadId: string) {
    if (!datoClient) {
      console.error(accessTokenError)
      return accessTokenError
    }

    return datoClient.uploads.find(uploadId)
  }

  function getModel(modelId: string) {
    if (!datoClient) {
      console.error(accessTokenError)
      return accessTokenError
    }

    return datoClient.items.find(modelId)
  }

  let thisBlock = null
  const fieldPath = ctx.fieldPath
  const indexOfDot = fieldPath.lastIndexOf('.')
  if (indexOfDot > -1) {
    const fieldPathBefore = fieldPath.slice(0, indexOfDot)
    thisBlock = getFieldValue(ctx.formValues, fieldPathBefore)
  }

  const variables: Variables = {
    getUpload: getUpload,
    getModel: getModel,
    getFieldValue: getFieldValue,
    changedField: changedField,
    locale: ctx.locale,
    datoCmsPlugin: ctx,
    thisBlock,
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
