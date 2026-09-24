import createItemLoader from './createItemLoader'

const records: Record<string, any> = {
  a: { id: 'a', title: 'A' },
  b: { id: 'b', title: 'B' },
  c: { id: 'c', title: 'C' },
}

function buildFakeClient({ failList = false } = {}) {
  return {
    items: {
      find: jest.fn(async (id: string) => {
        if (id in records) return records[id]
        throw new Error(`Record ${id} not found`)
      }),
      list: jest.fn(async ({ filter }: { filter: { ids: string } }) => {
        if (failList) throw new Error('Invalid filter')
        return filter.ids
          .split(',')
          .filter((id) => id in records)
          .map((id) => records[id])
      }),
    },
  }
}

describe('createItemLoader', () => {
  it('batches parallel calls into one list request', async () => {
    const client = buildFakeClient()
    const loadItem = createItemLoader(client)

    const items = await Promise.all(['a', 'b', 'c'].map(loadItem))

    expect(items).toEqual([records.a, records.b, records.c])
    expect(client.items.list).toHaveBeenCalledTimes(1)
    expect(client.items.list).toHaveBeenCalledWith({
      filter: { ids: 'a,b,c' },
      page: { limit: 3 },
    })
    expect(client.items.find).not.toHaveBeenCalled()
  })

  it('requests a repeated ID once', async () => {
    const client = buildFakeClient()
    const loadItem = createItemLoader(client)

    const items = await Promise.all(['a', 'a', 'b'].map(loadItem))

    expect(items).toEqual([records.a, records.a, records.b])
    expect(client.items.list).toHaveBeenCalledWith({
      filter: { ids: 'a,b' },
      page: { limit: 2 },
    })
  })

  it('uses find for a single ID', async () => {
    const client = buildFakeClient()
    const loadItem = createItemLoader(client)

    await expect(loadItem('a')).resolves.toEqual(records.a)
    expect(client.items.list).not.toHaveBeenCalled()
  })

  it('does not batch sequential calls', async () => {
    const client = buildFakeClient()
    const loadItem = createItemLoader(client)

    await loadItem('a')
    await loadItem('b')

    expect(client.items.find).toHaveBeenCalledTimes(2)
    expect(client.items.list).not.toHaveBeenCalled()
  })

  it('rejects IDs missing from the batch with the error find gives', async () => {
    const client = buildFakeClient()
    const loadItem = createItemLoader(client)

    const results = await Promise.allSettled(['a', 'missing'].map(loadItem))

    expect(results[0]).toEqual({ status: 'fulfilled', value: records.a })
    expect(results[1]).toEqual({
      status: 'rejected',
      reason: new Error('Record missing not found'),
    })
    expect(client.items.find).toHaveBeenCalledWith('missing')
  })

  it('falls back to find for every ID when the batch fails', async () => {
    const client = buildFakeClient({ failList: true })
    const loadItem = createItemLoader(client)

    const items = await Promise.all(['a', 'b'].map(loadItem))

    expect(items).toEqual([records.a, records.b])
    expect(client.items.find).toHaveBeenCalledTimes(2)
  })

  it('leaves invalid IDs to find', async () => {
    const client = buildFakeClient()
    const loadItem = createItemLoader(client)

    const results = await Promise.allSettled([
      loadItem('a'),
      loadItem(undefined as any),
    ])

    expect(results[1].status).toBe('rejected')
    expect(client.items.find).toHaveBeenCalledWith(undefined)
    expect(client.items.list).not.toHaveBeenCalled()
  })
})
