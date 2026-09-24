import { useState, useEffect, useRef } from 'react'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import { Canvas, Button, FieldError } from 'datocms-react-ui'

import CodeEditor from '../../components/CodeEditor/CodeEditor'
import RenderResults from '../../components/RenderResults/RenderResults'

import executeComputedCode from '../../lib/executeComputedCode'
import saveFieldValue from '../../lib/saveFieldValue'
import getObjectDifferences from '../../lib/objectDifference'
import isDependencyChange from '../../lib/isDependencyChange'
import createRecomputeScheduler, {
  Recompute,
  RecomputeScheduler,
} from '../../lib/createRecomputeScheduler'

import styles from './FieldExtension.module.css'

// Waits for edits to settle, so a burst of changes costs a single run.
export const RECOMPUTE_DELAY_MS = 300

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
  const [error, setError] = useState<string>()

  // The host pushes a new ctx on every form change; recomputes read the latest one.
  const latestCtx = useRef(ctx)
  latestCtx.current = ctx
  const previousFormValues = useRef(ctx.formValues)
  const scheduler = useRef<RecomputeScheduler>()

  function showError(caught: unknown) {
    console.error(caught)
    setError(caught instanceof Error ? caught.message : String(caught))
  }

  useEffect(() => {
    const recompute: Recompute = async (changedField, isOutdated) => {
      try {
        const result = await executeComputedCode(
          latestCtx.current,
          code,
          changedField,
        )
        if (isOutdated()) return
        setFieldValue(result)
        setError(undefined)
        saveFieldValue(latestCtx.current, result)
      } catch (caught) {
        if (isOutdated()) return
        showError(caught)
      }
    }

    const newScheduler = createRecomputeScheduler(RECOMPUTE_DELAY_MS, recompute)
    scheduler.current = newScheduler
    // Compute once when the record opens.
    newScheduler.schedule()

    return () => newScheduler.stop()
    //eslint-disable-next-line
  }, [])

  // Recompute when a field the code depends on changes.
  useEffect(() => {
    const changedPaths = Object.keys(
      getObjectDifferences(previousFormValues.current, ctx.formValues),
    )
    previousFormValues.current = ctx.formValues

    const changedDependency = changedPaths.find((changedPath) =>
      isDependencyChange(changedPath, ctx.fieldPath, code),
    )
    if (changedDependency) {
      scheduler.current?.schedule(changedDependency)
    }
  }, [ctx.formValues, ctx.fieldPath, code])

  async function executeEditedCode() {
    try {
      setFieldValue(await executeComputedCode(ctx, codeValue))
      setError(undefined)
    } catch (caught) {
      showError(caught)
    }
  }

  if (pluginParameters.hideField) {
    ctx.updateHeight(0)
    return null
  }

  return (
    <Canvas ctx={ctx}>
      {showCodeEditor && (
        <div className={styles.editorContainer}>
          <CodeEditor
            code={codeValue}
            onChange={setCodeValue}
            colorScheme={ctx.colorScheme}
          />

          <Button
            className={styles.button}
            buttonSize="s"
            onClick={executeEditedCode}
          >
            <span>Execute code</span>
          </Button>
        </div>
      )}

      <RenderResults fieldType={fieldType} value={fieldValue} />
      {error && <FieldError>{error}</FieldError>}
    </Canvas>
  )
}
