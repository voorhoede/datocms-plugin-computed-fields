import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import isEqual from 'lodash/isEqual'
import getFieldValue from './getFieldValue'

export default function saveFieldValue(
  ctx: RenderFieldExtensionCtx,
  fieldValue: any,
) {
  const fieldType: string = ctx.field.attributes.field_type
  const fieldPath: string = ctx.fieldPath
  const valueToSave =
    fieldType === 'json' ? JSON.stringify(fieldValue, undefined, 2) : fieldValue

  // Writing an unchanged value would still notify every other field on the form.
  if (!isEqual(getFieldValue(ctx.formValues, fieldPath), valueToSave)) {
    ctx.setFieldValue(fieldPath, valueToSave)
  }

  return valueToSave
}
