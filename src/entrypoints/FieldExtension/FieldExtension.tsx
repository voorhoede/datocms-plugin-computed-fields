import { useState, useCallback, useEffect } from 'react'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import { Canvas, Button } from 'datocms-react-ui'

import CodeEditor from '../../components/CodeEditor/CodeEditor'
import RenderResults from '../../components/RenderResults/RenderResults'

import executeComputedCode from '../../lib/executeComputedCode'
import saveFieldValue from '../../lib/saveFieldValue'
import objectDifference from '../../lib/objectDifference'

import styles from './FieldExtension.module.css'

type Props = {
  ctx: RenderFieldExtensionCtx
}

export default function FieldExtension({ ctx }: Props) {
  const pluginParameters: any = ctx.parameters
  const code: string = pluginParameters?.defaultFunction
  const showCodeEditor: string = pluginParameters?.editFunction

  const fieldType: string = ctx.field.attributes.field_type

  const [fieldValue, setFieldValue] = useState<string>('')
  const [codeValue, setCodeValue] = useState<string>(code)
  const [formValues, setFormValues] = useState<any>(ctx.formValues)

  const handleFieldValue: any = useCallback(
    async (
      ctx: RenderFieldExtensionCtx,
      codeToExecute: string,
      changedField?: string
    ) => {
      const codeResult = await executeComputedCode(
        ctx,
        codeToExecute,
        changedField
      )
      setFieldValue(codeResult)
      return codeResult
    },
    []
  )

  const differenceObject = objectDifference(formValues, ctx.formValues)
  Object.keys(differenceObject).forEach((key) => {
    if (code.includes(key)) {
      handleFieldValue(ctx, code, key).then((fieldValue: any) => {
        saveFieldValue(ctx, fieldValue)
        setFormValues(ctx.formValues)
      })
    }
  })

  useEffect(() => {
    handleFieldValue(ctx, code).then((fieldValue: any) => {
      saveFieldValue(ctx, fieldValue)
    })

    //eslint-disable-next-line
  }, [])

  if (pluginParameters.hideField) {
    ctx.updateHeight(0)
    return <></>
  }

  return (
    <Canvas ctx={ctx}>
      {showCodeEditor && (
        <div className={styles.editorContainer}>
          <CodeEditor code={codeValue} onChange={setCodeValue} />

          <Button
            className={styles.button}
            buttonSize="s"
            onClick={() => handleFieldValue(ctx, codeValue)}
          >
            <span>Execute code</span>
          </Button>
        </div>
      )}

      <RenderResults fieldType={fieldType} value={fieldValue} />
    </Canvas>
  )
}
