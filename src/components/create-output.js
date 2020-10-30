let element

export default function createOutput(main, fieldType) {
  console.log(fieldType)
  switch (fieldType) {
    case 'text':
    case 'json': {
      element = document.createElement('textarea')
      element.setAttribute('readonly', true)
      element.style.height = 'auto'
      break
    }
    case 'boolean': {
      element = document.createElement('div')
      const button = document.createElement('button')
      const buttonSpan = document.createElement('span')
      const label = document.createElement('label')
      const labelSpan = document.createElement('span')

      element.classList.add('boolean')
      button.setAttribute('readonly', true)
      button.classList.add('boolean__switch')
      buttonSpan.classList.add('boolean__switch-inner')
      button.appendChild(buttonSpan)
      label.classList.add('boolean__switch-label')

      label.appendChild(labelSpan)
      element.appendChild(button)
      element.appendChild(label)
      break
    }
    default: {
      element = document.createElement('input')
      element.setAttribute('type', 'text')
      element.setAttribute('readonly', true)
      break
    }
  }

  main.appendChild(element)
}

export function updateElementValue(newValue, fieldType) {
  let value = newValue

  switch (fieldType) {
    case 'json': {
      value = JSON.stringify(newValue, undefined, 2)
      element.textContent = value
      element.style.height = element.scrollHeight + 'px'
      break
    }
    case 'text': {
      element.textContent = newValue
      element.style.height = element.scrollHeight + 'px'
      break
    }
    case 'boolean': {
      const button = element.querySelector('button')
      if (newValue) {
        button.classList.add('boolean__switch--checked')
      } else {
        button.classList.remove('boolean__switch--checked')
      }

      const label = element.querySelector('.boolean__switch-label span')
      label.innerHTML = newValue
      break
    }
    default: {
      element.value = newValue
      break
    }
  }

  return value
}
