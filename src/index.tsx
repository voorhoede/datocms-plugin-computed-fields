import {
  connect,
  OnBootCtx,
  RenderFieldExtensionCtx,
  RenderManualFieldExtensionConfigScreenCtx,
} from 'datocms-plugin-sdk'

import ConfigScreen from './entrypoints/ConfigScreen/ConfigScreen'
import FieldExtension from './entrypoints/FieldExtension/FieldExtension'
import FieldExtensionConfigScreen from './entrypoints/FieldExtensionConfigScreen/FieldExtensionConfigScreen'

import { render } from './utils/render'
import migrateFields from './lib/migrateFields'

import 'datocms-react-ui/styles.css'
import './styles/index.css'

const fieldSettings = {
  id: 'computedFields',
  name: 'Computed Fields',
}

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />)
  },
  manualFieldExtensions() {
    return [
      {
        id: fieldSettings.id,
        name: fieldSettings.name,
        type: 'editor',
        fieldTypes: 'all',
        configurable: true,
      },
    ]
  },
  renderManualFieldExtensionConfigScreen(
    _,
    ctx: RenderManualFieldExtensionConfigScreenCtx
  ) {
    return render(<FieldExtensionConfigScreen ctx={ctx} />)
  },
  renderFieldExtension(_, ctx: RenderFieldExtensionCtx) {
    return render(<FieldExtension ctx={ctx} />)
  },
  async onBoot(ctx: OnBootCtx) {
    await migrateFields(ctx, fieldSettings.id)
  },
})
