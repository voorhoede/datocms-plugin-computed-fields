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

export function createEditor(main, code, executeComputedCode) {
  const button = document.createElement('button')
  const codeSection = document.createElement('section')
  const codeMirrorContainer = document.createElement('div')

  codeSection.appendChild(codeMirrorContainer)
  codeSection.classList.add('code-section')
  codeSection.appendChild(button)

  button.classList.add('button')
  button.textContent = 'Execute code'
  button.addEventListener('click', () => {
    executeComputedCode()
  })

  main.appendChild(codeSection)
  return codeEditor(codeMirrorContainer, code)
}
