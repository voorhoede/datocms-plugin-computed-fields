/**
 * @jest-environment jsdom
 */
import { createRoot, Root } from 'react-dom/client'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import set from 'lodash/set'

import FieldExtension, { RECOMPUTE_DELAY_MS } from './FieldExtension'

jest.mock('datocms-react-ui', () => {
  const React = require('react')
  const passthrough = ({ children }: any) =>
    React.createElement(React.Fragment, null, children)
  return {
    Canvas: passthrough,
    Button: passthrough,
    FieldError: passthrough,
    TextField: () => null,
    SwitchField: () => null,
  }
})

jest.mock('../../components/CodeEditor/CodeEditor', () => () => null)

const FETCH_DELAY_MS = 100

const records: Record<string, any> = {
  product1: { slug: 'drink', title: 'Drink', category: 'category1' },
  format1: { slug: 'bottle', title: 'Bottle' },
  style1: { slug: 'lemon', title: 'Lemon' },
  style2: { slug: 'orange', title: 'Orange' },
  style3: { slug: 'lime', title: 'Lime' },
  category1: { slug: 'drinks' },
}

const mockFind = jest.fn(
  (id: string) =>
    new Promise((resolve, reject) =>
      setTimeout(
        () =>
          id in records
            ? resolve(records[id])
            : reject(new Error(`Record ${id} not found`)),
        FETCH_DELAY_MS,
      ),
    ),
)

const mockList = jest.fn(
  ({ filter }: { filter: { ids: string } }) =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            filter.ids
              .split(',')
              .filter((id) => id in records)
              .map((id) => ({ id, ...records[id] })),
          ),
        FETCH_DELAY_MS,
      ),
    ),
)

const requestCount = () =>
  mockFind.mock.calls.length + mockList.mock.calls.length

jest.mock('@datocms/cma-client-browser', () => ({
  buildClient: () => ({ items: { find: mockFind, list: mockList } }),
}))

// Mirrors the customer's setup: every field fetches the same four records.
const fetchRecords = `
  const [p, f, s] = await Promise.all([getModel(product), getModel(format), getModel(style)])
  const c = await getModel(p.category)
`

const fieldCodes: Record<string, string> = {
  slug: `globalThis.runs.push('slug')
    ${fetchRecords}
    return p.slug + '/' + s.slug + '-' + f.slug + '-' + gtin`,
  label: `globalThis.runs.push('label')
    ${fetchRecords}
    const label = p.title + ' ' + f.title + ' - ' + s.title + ' - ' + gtin
    return label`,
  production_url: `globalThis.runs.push('production_url')
    ${fetchRecords}
    return 'https://example.com/' + c.slug + '/' + p.slug + '/' + s.slug + '-' + f.slug + '-' + gtin`,
}

type HostField = {
  fieldPath: string
  code: string
  root: Root
  container: HTMLElement
}

/** Stands in for the DatoCMS form: one iframe per field, ctx pushed asynchronously. */
class FakeHost {
  formValues: Record<string, any>
  fields: HostField[] = []

  constructor(formValues: Record<string, any>) {
    this.formValues = formValues
  }

  setFieldValue = jest.fn(async (path: string, value: unknown) => {
    this.change(path, value)
  })

  mount(codes: Record<string, string>) {
    for (const [fieldPath, code] of Object.entries(codes)) {
      const container = document.createElement('div')
      document.body.appendChild(container)
      this.fields.push({
        fieldPath,
        code,
        root: createRoot(container),
        container,
      })
    }
    this.renderAll()
  }

  /** Only broadcasts real changes, the most lenient assumption about the host. */
  change(path: string, value: unknown) {
    if (isEqual(get(this.formValues, path), value)) return
    this.formValues = set(cloneDeep(this.formValues), path, value)
    setTimeout(() => this.renderAll(), 0)
  }

  renderAll() {
    for (const field of this.fields) {
      field.root.render(<FieldExtension ctx={this.buildCtx(field)} />)
    }
  }

  buildCtx(field: HostField): any {
    return {
      formValues: this.formValues,
      fieldPath: field.fieldPath,
      field: { attributes: { field_type: 'string' } },
      parameters: { defaultFunction: field.code, editFunction: false },
      currentUserAccessToken: 'token',
      environment: 'main',
      locale: 'en',
      setFieldValue: this.setFieldValue,
      updateHeight: jest.fn(),
    }
  }

  writesTo(path: string) {
    return this.setFieldValue.mock.calls.filter(([p]) => p === path)
  }

  unmount() {
    this.fields.forEach((field) => field.root.unmount())
  }
}

const initialValues = {
  product: 'product1',
  format: 'format1',
  style: 'style1',
  gtin: '123',
  unrelated: 'a',
  slug: 'drink/lemon-bottle-123',
  label: 'Drink Bottle - Lemon - 123',
  production_url: 'https://example.com/drinks/drink/lemon-bottle-123',
}

const settle = () => jest.advanceTimersByTimeAsync(10_000)

const runCounts = () =>
  (globalThis as any).runs.reduce(
    (acc: Record<string, number>, name: string) => ({
      ...acc,
      [name]: (acc[name] ?? 0) + 1,
    }),
    {},
  )

let host: FakeHost
let consoleError: jest.SpyInstance

beforeEach(() => {
  jest.useFakeTimers()
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false
  ;(globalThis as any).runs = []
  mockFind.mockClear()
  mockList.mockClear()
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  host.unmount()
  document.body.innerHTML = ''
  jest.useRealTimers()
  consoleError.mockRestore()
})

describe('FieldExtension', () => {
  it('runs each field once when the record opens', async () => {
    host = new FakeHost(initialValues)
    host.mount(fieldCodes)
    await settle()

    expect(runCounts()).toEqual({ slug: 1, label: 1, production_url: 1 })
    // Per field: product, format and style in one batch, then the category.
    expect(requestCount()).toBe(6)
  })

  it('does not write values that are already up to date', async () => {
    host = new FakeHost(initialValues)
    host.mount(fieldCodes)
    await settle()

    expect(host.setFieldValue).not.toHaveBeenCalled()
  })

  it('recomputes each dependent field once per input change', async () => {
    host = new FakeHost(initialValues)
    host.mount(fieldCodes)
    await settle()
    ;(globalThis as any).runs = []

    host.change('style', 'style2')
    await settle()

    const counts = runCounts()
    expect(counts.slug).toBe(1)
    expect(counts.label).toBe(1)
    // production_url's code mentions "slug", so the slug write triggers it once more.
    expect(counts.production_url).toBeLessThanOrEqual(2)
    expect(host.formValues.slug).toBe('drink/orange-bottle-123')
    expect(host.formValues.label).toBe('Drink Bottle - Orange - 123')
    expect(host.formValues.production_url).toBe(
      'https://example.com/drinks/drink/orange-bottle-123',
    )
  })

  it('coalesces rapid input changes into a single run', async () => {
    host = new FakeHost(initialValues)
    host.mount(fieldCodes)
    await settle()
    ;(globalThis as any).runs = []

    for (const style of ['style2', 'style3', 'style2', 'style3']) {
      host.change('style', style)
      await jest.advanceTimersByTimeAsync(50)
    }
    await settle()

    expect(runCounts().slug).toBe(1)
    expect(host.formValues.slug).toBe('drink/lime-bottle-123')
  })

  it('discards the result of a run superseded by a newer change', async () => {
    host = new FakeHost(initialValues)
    host.mount({ slug: fieldCodes.slug })
    await settle()

    host.change('style', 'style2')
    // Let the debounced run start and wait on its fetches.
    await jest.advanceTimersByTimeAsync(RECOMPUTE_DELAY_MS + FETCH_DELAY_MS / 2)
    expect(runCounts().slug).toBe(2)
    host.change('style', 'style3')
    await settle()

    expect(host.writesTo('slug').map(([, value]) => value)).toEqual([
      'drink/lime-bottle-123',
    ])
  })

  it('does not write or loop when the code fails', async () => {
    host = new FakeHost({ ...initialValues, style: 'missing' })
    host.mount({ slug: fieldCodes.slug })
    await settle()

    host.change('gtin', '456')
    await settle()

    expect(runCounts().slug).toBe(2)
    expect(host.writesTo('slug')).toEqual([])
    expect(host.fields[0].container.textContent).toContain(
      'Record missing not found',
    )
  })

  it('ignores changes to fields the code does not mention', async () => {
    host = new FakeHost(initialValues)
    host.mount(fieldCodes)
    await settle()
    ;(globalThis as any).runs = []

    host.change('unrelated', 'b')
    await settle()

    expect(runCounts()).toEqual({})
  })
})
