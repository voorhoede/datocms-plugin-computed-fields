type Batch = {
  ids: Set<string>
  itemsById: Promise<Map<string, any>>
}

/**
 * Returns an `items.find` replacement: calls made together (e.g. in `Promise.all`)
 * share a single `items.list` request.
 * Whatever the batch can't provide falls back to `items.find`,
 * so results and errors are the same as fetching records one by one.
 */
export default function createItemLoader(client: any) {
  let openBatch: Batch | undefined

  async function fetchBatch(ids: Set<string>) {
    // A single record is fetched by `items.find` anyway.
    if (ids.size < 2) return new Map()

    try {
      const items: any[] = await client.items.list({
        filter: { ids: Array.from(ids).join(',') },
        page: { limit: ids.size },
      })
      return new Map(items.map((item) => [item.id, item]))
    } catch {
      return new Map()
    }
  }

  function openNewBatch(): Batch {
    const ids = new Set<string>()
    // Wait for the current tick to end, so every call made together joins the batch.
    const itemsById = Promise.resolve().then(() => {
      openBatch = undefined
      return fetchBatch(ids)
    })
    return { ids, itemsById }
  }

  return async function loadItem(id: string) {
    // Odd IDs (e.g. `undefined`) would make the whole batch fail.
    if (typeof id !== 'string' || id === '') {
      return client.items.find(id)
    }

    openBatch = openBatch ?? openNewBatch()
    openBatch.ids.add(id)
    const itemsById = await openBatch.itemsById

    return itemsById.get(id) ?? client.items.find(id)
  }
}
