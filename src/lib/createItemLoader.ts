// Maximum `page[limit]` of the CMA items endpoint.
const MAX_BATCH_SIZE = 500

type PendingRequest = {
  resolve: (item: any) => void
  reject: (error: unknown) => void
}

/**
 * Returns an `items.find` replacement that batches calls made in the same tick
 * into a single `items.list` request with `filter[ids]`.
 * IDs missing from the batched response, and every ID of a failed batch,
 * fall back to `items.find`, so results and errors match individual calls.
 */
export default function createItemLoader(client: any) {
  let queue = new Map<string, PendingRequest[]>()

  function findEach(ids: string[], requests: Map<string, PendingRequest[]>) {
    for (const id of ids) {
      const pending = requests.get(id)!
      client.items.find(id).then(
        (item: any) => pending.forEach(({ resolve }) => resolve(item)),
        (error: unknown) => pending.forEach(({ reject }) => reject(error)),
      )
    }
  }

  function loadBatch(ids: string[], requests: Map<string, PendingRequest[]>) {
    if (ids.length === 1) {
      findEach(ids, requests)
      return
    }

    client.items
      .list({ filter: { ids: ids.join(',') }, page: { limit: ids.length } })
      .then(
        (items: any[]) => {
          const itemsById = new Map(items.map((item) => [item.id, item]))
          for (const id of ids) {
            if (itemsById.has(id)) {
              requests
                .get(id)!
                .forEach(({ resolve }) => resolve(itemsById.get(id)))
            }
          }
          findEach(
            ids.filter((id) => !itemsById.has(id)),
            requests,
          )
        },
        () => findEach(ids, requests),
      )
  }

  function flush() {
    const requests = queue
    queue = new Map()
    const ids = Array.from(requests.keys())
    for (let start = 0; start < ids.length; start += MAX_BATCH_SIZE) {
      loadBatch(ids.slice(start, start + MAX_BATCH_SIZE), requests)
    }
  }

  return function loadItem(id: string): Promise<any> {
    // Leave odd IDs (e.g. `undefined`) to `items.find`, so they can't fail a whole batch.
    if (typeof id !== 'string' || id === '') {
      return client.items.find(id)
    }

    return new Promise((resolve, reject) => {
      if (queue.size === 0) {
        Promise.resolve().then(flush)
      }
      queue.set(id, [...(queue.get(id) ?? []), { resolve, reject }])
    })
  }
}
