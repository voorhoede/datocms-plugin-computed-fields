import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'

export default function saveFieldValue(ctx: RenderFieldExtensionCtx, fieldValue: any) {
  const fieldType: string = ctx.field.attributes.field_type
  const fieldPath: string = ctx.fieldPath

  switch (fieldType) {
    case 'json': {
      const jsonValue = JSON.stringify(fieldValue, undefined, 2)
      ctx.setFieldValue(fieldPath, jsonValue)
      return jsonValue
    }
    default: {
      ctx.setFieldValue(fieldPath, fieldValue)
      return fieldValue
    }
  }
}