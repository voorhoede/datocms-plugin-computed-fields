import difference from "../lib/objectDifference";

class TestObject {
  text_field: string | undefined = undefined
  boolean_field: boolean = true
  single_ref_link: string = ""
  multiple_ref_links: string[] = []
  blocks: TestBlock[] = []

  constructor(text_field: string | undefined, boolean_field: boolean, single_ref_link: string, multiple_ref_links: string[], blocks: TestBlock[]) {
    this.text_field = text_field;
    this.boolean_field = boolean_field;
    this.single_ref_link = single_ref_link;
    this.multiple_ref_links = multiple_ref_links;
    this.blocks = blocks;
  }
}

class TestBlock {
  block_text_field: string | null = null
  block_boolean_field: boolean = true
  block_single_ref_link: string = ""
  block_multiple_ref_links: string[] = []
  block_blocks: TestBlock[] = []

  constructor(block_text_field: string | null, block_boolean_field: boolean, block_single_ref_link: string, block_multiple_ref_links: string[], block_blocks: TestBlock[]) {
    this.block_text_field = block_text_field;
    this.block_boolean_field = block_boolean_field;
    this.block_single_ref_link = block_single_ref_link;
    this.block_multiple_ref_links = block_multiple_ref_links;
    this.block_blocks = block_blocks;
  }
}

let BASE_BLOCK = new TestBlock("", true, "", [], [])

let BASE_OBJECT = new TestObject(
  "",
  true,
  "",
  [],
  [])

// noinspection JSUnusedLocalSymbols
let EXAMPLE_OBJECT_GENERATED_BY_DATO_CMS_FOR_REFERENCE = {
  "text_child_field": "Child 1",
  "boolean_child_field": false,
  "blocks_child_field": [{
    "text_block_field": "Child 1 - Block 1",
    "boolean_block_field": true,
    "blocks_block_field": [{
      "text_block_field": "Child 1 - Block 1 - Block 1",
      "boolean_block_field": false,
      "blocks_block_field": [],
      "links_block_field": [],
      "itemId": "151099088",
      "itemTypeId": "2050806"
    }, {
      "text_block_field": "Child 1 - Block 1 - Block 2",
      "boolean_block_field": false,
      "blocks_block_field": [],
      "links_block_field": [],
      "itemId": "151099089",
      "itemTypeId": "2050806"
    }],
    "links_block_field": ["151099098", "151099103"],
    "itemId": "151099086",
    "itemTypeId": "2050806"
  }, {
    "text_block_field": "Child 1 - Block 2",
    "boolean_block_field": false,
    "blocks_block_field": [{
      "text_block_field": "Child 1 - Block 2 - Block 1",
      "boolean_block_field": false,
      "blocks_block_field": [],
      "links_block_field": [],
      "itemId": "151099090",
      "itemTypeId": "2050806"
    }, {
      "text_block_field": "Child 1 - Block 2 - Block 2",
      "boolean_block_field": false,
      "blocks_block_field": [],
      "links_block_field": [],
      "itemId": "151099091",
      "itemTypeId": "2050806"
    }],
    "links_block_field": ["151099104", "151099105"],
    "itemId": "151099092",
    "itemTypeId": "2050806"
  }],
  "single_link_field": "151099094",
  "links_child_field": ["151099094", "151099095"],
  "compute": "Test",
  "internalLocales": []
}

describe('objectDifference.ts tests', () => {

  it('test no change', () => {
    expect(difference(
      BASE_OBJECT,
      BASE_OBJECT
    )).toEqual({})
  })

  it('test text modification', () => {
    expect(difference({
      ...BASE_OBJECT,
      text_field: "aaa"
    }, {
      ...BASE_OBJECT,
      text_field: "bbb"
    })).toEqual({
      text_field: "bbb"
    })
  })

  it('test boolean modification', () => {
    expect(difference({
      ...BASE_OBJECT,
      boolean_field: false
    }, {
      ...BASE_OBJECT,
      boolean_field: true
    })).toEqual({
      boolean_field: true
    })
  })

  it('test link change', () => {
    expect(difference({
      ...BASE_OBJECT,
      single_ref_link: "123"
    }, {
      ...BASE_OBJECT,
      single_ref_link: "999"
    })).toEqual({
      single_ref_link: "999"
    })
  })

  it('test links removal', () => {
    expect(difference({
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456", "789"]
    }, {
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456"]
    })).toEqual({
      "multiple_ref_links.2": null
    })
  })

  it('test links modification', () => {
    expect(difference({
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456", "789"]
    }, {
      ...BASE_OBJECT,
      multiple_ref_links: ["000", "456", "789"]
    })).toEqual({
      "multiple_ref_links.0": "000"
    })
  })

  it('test links append', () => {
    expect(difference({
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456", "789"]
    }, {
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456", "789", "000"]
    })).toEqual({
      "multiple_ref_links.3": "000",
    })
  })

  it('test links prepend', () => {
    expect(difference({
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456", "789"]
    }, {
      ...BASE_OBJECT,
      multiple_ref_links: ["000", "123", "456", "789"]
    })).toEqual({
      "multiple_ref_links.0": "000",
      "multiple_ref_links.1": "123",
      "multiple_ref_links.2": "456",
      "multiple_ref_links.3": "789",
    })
  })

  it('test links insert', () => {
    expect(difference({
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "456", "789"]
    }, {
      ...BASE_OBJECT,
      multiple_ref_links: ["123", "000", "456", "789"]
    })).toEqual({
      "multiple_ref_links.1": "000",
      "multiple_ref_links.2": "456",
      "multiple_ref_links.3": "789",
    })
  })

  it('test blocks removal', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }]
    })).toEqual({
      "blocks.1.block_boolean_field": null,
      "blocks.1.block_single_ref_link": null,
      "blocks.1.block_text_field": null,
    })
  })

  it('test blocks modification', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "changed_2"
      }]
    })).toEqual({
      "blocks.1.block_text_field": "changed_2",
    })
  })

  it('test blocks append', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_3"
      }]
    })).toEqual({
      "blocks.2.block_boolean_field": true,
      "blocks.2.block_single_ref_link": null,
      "blocks.2.block_text_field": "text_3",
    })
  })

  it('test blocks prepend', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_0"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.0.block_text_field": "text_0",
      "blocks.1.block_text_field": "text_1",
      "blocks.2.block_boolean_field": true,
      "blocks.2.block_single_ref_link": null,
      "blocks.2.block_text_field": "text_2",
    })
  })

  it('test blocks insert', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_1.5"
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.1.block_text_field": "text_1.5",
      "blocks.2.block_boolean_field": true,
      "blocks.2.block_single_ref_link": null,
      "blocks.2.block_text_field": "text_2",
    })
  })

  it('test blocks\' inner links removal', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.0.block_multiple_ref_links.1": null,
    })
  })

  it('test blocks\' inner links modification', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "000"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.0.block_multiple_ref_links.1": "000",
    })
  })

  it('test blocks\' inner links append', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "456", "789"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.0.block_multiple_ref_links.2": "789",
    })
  })

  it('test blocks\' inner links prepend', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["000", "123", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.0.block_multiple_ref_links.0": "000",
      "blocks.0.block_multiple_ref_links.1": "123",
      "blocks.0.block_multiple_ref_links.2": "456",
    })
  })

  it('test blocks\' inner links insert', () => {
    expect(difference({
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    }, {
      ...BASE_OBJECT,
      blocks: [{
        ...BASE_BLOCK,
        block_text_field: "text_1",
        block_multiple_ref_links: ["123", "000", "456"]
      }, {
        ...BASE_BLOCK,
        block_text_field: "text_2"
      }]
    })).toEqual({
      "blocks.0.block_multiple_ref_links.1": "000",
      "blocks.0.block_multiple_ref_links.2": "456",
    })
  })

  it('test list of blocks with containing links to other models', () => {

    const originalObj = {
      "blocks": [{
        "deletedField": "deletedFieldValue",
        "links": ["4676593"],
      }]
    }
    const newObj = {
      "blocks": [{
        "links": ["4676593", "4676624"],
        "newField": "newFieldValue"
      }]
    }

    expect(difference(originalObj, newObj)).toEqual({
      "blocks.0.deletedField": null,
      "blocks.0.links.1": "4676624",
      "blocks.0.newField": "newFieldValue"
    })
  })
})
