import isDependencyChange from './isDependencyChange'

describe('isDependencyChange', () => {
  it('is true when the code mentions the changed field', () => {
    expect(isDependencyChange('title', 'slug', 'return title')).toBe(true)
  })

  it('is false when the code does not mention the changed field', () => {
    expect(isDependencyChange('title', 'slug', 'return gtin')).toBe(false)
  })

  it('ignores changes to the field itself', () => {
    expect(isDependencyChange('slug', 'slug', 'return p.slug')).toBe(false)
  })

  it('ignores changes nested inside the field itself', () => {
    expect(isDependencyChange('links.0', 'links', 'return links')).toBe(false)
  })

  it('matches sibling fields by name inside a block', () => {
    expect(
      isDependencyChange(
        'blocks.0.title',
        'blocks.0.slug',
        'return thisBlock.title',
      ),
    ).toBe(true)
  })

  it('ignores the computed field itself inside a block', () => {
    expect(
      isDependencyChange(
        'blocks.0.slug',
        'blocks.0.slug',
        'return thisBlock.slug',
      ),
    ).toBe(false)
  })
})
