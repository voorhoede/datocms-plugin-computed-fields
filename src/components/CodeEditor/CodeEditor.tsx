import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

type Props = {
  code: string
  onChange: (value: string) => void
  colorScheme?: string
}

export default function CodeEditor({ code, onChange, colorScheme }: Props) {
  return (
    <CodeMirror
      value={code}
      minHeight="200px"
      extensions={[javascript()]}
      onChange={onChange}
      theme={colorScheme === 'dark' ? oneDark : 'light'}
    />
  )
}
