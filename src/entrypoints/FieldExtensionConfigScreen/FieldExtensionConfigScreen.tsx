import { useState } from 'react'
import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk'
import {
  Canvas,
  Form,
  SwitchField,
  FormLabel,
  FieldHint,
  FieldGroup,
} from 'datocms-react-ui'

import CodeEditor from '../../components/CodeEditor/CodeEditor'

type Props = {
  ctx: RenderManualFieldExtensionConfigScreenCtx
}

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const pluginParameters = ctx.parameters
  const [editFunctionValue, setEditFunctionValue] = useState<boolean>(
    Boolean(pluginParameters?.editFunction),
  )
  const [hideFieldValue, setHideFieldValue] = useState<boolean>(
    Boolean(pluginParameters?.hideField),
  )
  const [defaultFunction, setDefaultFunction] = useState<string>(
    pluginParameters?.defaultFunction
      ? String(pluginParameters?.defaultFunction)
      : '',
  )

  function handleEditFunctionChange(newValue: boolean) {
    setEditFunctionValue(newValue)
    ctx.setParameters({ ...pluginParameters, editFunction: newValue })
  }

  function handleHideFieldChange(newValue: boolean) {
    setHideFieldValue(newValue)
    ctx.setParameters({ ...pluginParameters, hideField: newValue })
  }

  function handleDefaultFunctionChange(newValue: string) {
    setDefaultFunction(newValue)
    ctx.setParameters({ ...pluginParameters, defaultFunction: newValue })
  }

  return (
    <Canvas ctx={ctx}>
      <Form>
        <SwitchField
          id="editFunction"
          name="editFunction"
          label="Show debug code editor"
          value={editFunctionValue}
          onChange={handleEditFunctionChange}
        />

        <FieldGroup>
          <FormLabel htmlFor="defaultFunction">
            Enter the default function
          </FormLabel>
          <CodeEditor
            code={defaultFunction}
            onChange={handleDefaultFunctionChange}
          />
          <FieldHint>
            This field always needs a return (i.e. return title)
          </FieldHint>
        </FieldGroup>

        <SwitchField
          id="hideField"
          name="hideField"
          label="Hide field"
          hint="This will hide the field, but will not hide the title"
          value={hideFieldValue}
          onChange={handleHideFieldChange}
        />
      </Form>
    </Canvas>
  )
}
