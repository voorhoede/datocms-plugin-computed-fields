import * as CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript'

export default function codeEditor(container, code) {
  return CodeMirror(container, {
    value: code || '',
    mode: 'javascript',
    theme: 'monokai',
    lineNumbers: true,
    tabSize: 2,
  })
}
