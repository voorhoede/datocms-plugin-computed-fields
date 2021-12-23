import { TextField, SwitchField, FieldError } from 'datocms-react-ui'

import styles from './RenderResults.module.css'

type Props = {
  value: any
  fieldType: string
}

export default function CodeEditor({ value, fieldType }: Props) {
  switch (fieldType) {
    case 'text': {
      let hasError = false
      if (typeof value !== 'string') {
        hasError = true
      }

      return (
        <>
          <textarea className={styles.textarea} readOnly value={value} />
          {hasError && <FieldError>Please return an object</FieldError>}
        </>
      )
    }
    case 'json': {
      let hasError = false
      if (typeof value !== 'object') {
        hasError = true
      }

      const jsonValue = JSON.stringify(value, undefined, 2)
      return (
        <>
          <pre>{jsonValue}</pre>
          {hasError && <FieldError>Please return an object</FieldError>}
        </>
      )
    }
    case 'boolean': {
      let hasError = false
      if (typeof value !== 'boolean') {
        hasError = true
      }

      return (
        <SwitchField
          label="Value"
          value={value}
          id="computed-field--boolean"
          name="computed-field--boolean"
          error={hasError ? 'Please return a boolean' : ''}
          onChange={() => {}}
          formLabelProps={{
            children: <></>,
            htmlFor: 'computed-field--boolean',
            className: 'sr-only',
          }}
        />
      )
    }
    case 'integer':
    case 'float': {
      let hasError = false
      if (typeof value !== 'number') {
        hasError = true
      }

      return (
        <TextField
          label="Value"
          value={value}
          id="computed-field--integer"
          name="computed-field--integer"
          error={hasError ? 'Please return a number' : ''}
          placeholder="123"
          onChange={() => {}}
          formLabelProps={{
            children: <></>,
            htmlFor: 'computed-field--integer',
            className: 'sr-only',
          }}
          textInputProps={{
            readOnly: true,
            type: 'number',
          }}
        />
      )
    }
    default: {
      let hasError = false
      if (typeof value !== 'string') {
        hasError = true
      }

      return (
        <TextField
          label="Value"
          value={value}
          id="computed-field--text-field"
          name="computed-field--text-field"
          placeholder="String"
          error={hasError ? 'Please return a string' : ''}
          onChange={() => {}}
          formLabelProps={{
            children: <></>,
            htmlFor: 'computed-field--text-field',
            className: 'sr-only',
          }}
          textInputProps={{
            readOnly: true,
          }}
        />
      )
    }
  }
}
