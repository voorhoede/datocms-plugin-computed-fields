import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

type Props = {
  code: string
  onChange: (value: string) => void
}

export default function CodeEditor({ code, onChange }: Props) {
  return (
    <CodeMirror
      value={code}
      minHeight="200px"
      extensions={[javascript()]}
      onChange={onChange}
      theme={oneDark}
    />
  )
}
