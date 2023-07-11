import getObjectDifferences from './objectDifference'

const baseBlock = {
  text_field: '',
  boolean_field: true,
  text_field_2: '',
  array: [],
}

describe('getObjectDifferences', () => {
  it('should be empty object when there are no differences', () => {
    expect(
      getObjectDifferences(
        {
          text_field: '',
        },
        {
          text_field: '',
        },
      ),
    ).toEqual({})
  })

  it('should return object with text_field changes', () => {
    expect(
      getObjectDifferences(
        {
          text_field: 'aaa',
        },
        {
          text_field: 'bbb',
        },
      ),
    ).toEqual({
      text_field: 'bbb',
    })
  })

  it('should return object with boolean_field changes', () => {
    expect(
      getObjectDifferences(
        {
          boolean_field: false,
        },
        {
          boolean_field: true,
        },
      ),
    ).toEqual({
      boolean_field: true,
    })
  })

  it('should return object with value of null when item is removed', () => {
    expect(
      getObjectDifferences(
        {
          multiple_strings: ['123', '456', '789'],
        },
        {
          multiple_strings: ['123', '456'],
        },
      ),
    ).toEqual({
      'multiple_strings.2': null,
    })
  })

  it('should return object with value of 000 when item is changed', () => {
    expect(
      getObjectDifferences(
        {
          multiple_strings: ['123', '456', '789'],
        },
        {
          multiple_strings: ['000', '456', '789'],
        },
      ),
    ).toEqual({
      'multiple_strings.0': '000',
    })
  })

  it('should return object with appended value', () => {
    expect(
      getObjectDifferences(
        {
          multiple_strings: ['123', '456', '789'],
        },
        {
          multiple_strings: ['123', '456', '789', '000'],
        },
      ),
    ).toEqual({
      'multiple_strings.3': '000',
    })
  })

  it('should return object with full array with inserted value', () => {
    expect(
      getObjectDifferences(
        {
          multiple_strings: ['123', '456', '789'],
        },
        {
          multiple_strings: ['000', '123', '456', '789'],
        },
      ),
    ).toEqual({
      'multiple_strings.0': '000',
      'multiple_strings.1': '123',
      'multiple_strings.2': '456',
      'multiple_strings.3': '789',
    })
  })

  it('should return object with null values of the blocks that are deleted', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.1.boolean_field': null,
      'blocks.1.text_field_2': null,
      'blocks.1.text_field': null,
    })
  })

  it('should return object with changed block value', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              text_field: 'text_1',
            },
            {
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              text_field: 'text_1',
            },
            {
              text_field: 'changed_2',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.1.text_field': 'changed_2',
    })
  })

  it('should return object with appended block values', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
            {
              ...baseBlock,
              text_field: 'text_3',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.2.boolean_field': true,
      'blocks.2.text_field': 'text_3',
      'blocks.2.text_field_2': null,
    })
  })

  it('should return object with all blocks with inserted value', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_0',
            },
            {
              ...baseBlock,
              text_field: 'text_1',
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.0.text_field': 'text_0',
      'blocks.1.text_field': 'text_1',
      'blocks.2.boolean_field': true,
      'blocks.2.text_field': 'text_2',
      'blocks.2.text_field_2': null,
    })
  })

  it('should return object with value of null when inner item is removed', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123', '456'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.0.array.1': null,
    })
  })

  it('should return object with a value when inner item is changed', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123', '456'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123', '000'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.0.array.1': '000',
    })
  })

  it('should return object with a value when inner item is appended', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123', '456'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123', '456', '789'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.0.array.2': '789',
    })
  })

  it('should return object with values of changed inner item', () => {
    expect(
      getObjectDifferences(
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['123', '456'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
        {
          blocks: [
            {
              ...baseBlock,
              text_field: 'text_1',
              array: ['000', '123', '456'],
            },
            {
              ...baseBlock,
              text_field: 'text_2',
            },
          ],
        },
      ),
    ).toEqual({
      'blocks.0.array.0': '000',
      'blocks.0.array.1': '123',
      'blocks.0.array.2': '456',
    })
  })
})
