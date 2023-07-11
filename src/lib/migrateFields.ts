import { OnBootCtx } from 'datocms-plugin-sdk'

export default async function migrateFields(ctx: OnBootCtx, fieldId: string) {
  // if we already performed the migration, skip
  if (ctx.plugin.attributes.parameters.migratedFromLegacyPlugin) {
    return
  }

  // if the current user cannot edit fields' settings, skip
  if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
    return
  }

  // get all the fields currently associated to the plugin...
  const fields = await ctx.loadFieldsUsingPlugin()

  // ... and for each of them...
  await Promise.all(
    fields.map(async (field: any) => {
      // set the fieldExtensionId to be the new one
      await ctx.updateFieldAppearance(field.id, [
        {
          operation: 'updateEditor',
          newFieldExtensionId: fieldId,
        },
      ])
    }),
  )

  // save in configuration the fact that we already performed the migration
  ctx.updatePluginParameters({
    ...ctx.plugin.attributes.parameters,
    migratedFromLegacyPlugin: true,
  })
}
