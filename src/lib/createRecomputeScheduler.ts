export type Recompute = (
  changedField: string | undefined,
  isOutdated: () => boolean,
) => Promise<void>

export type RecomputeScheduler = {
  schedule: (changedField?: string) => void
  stop: () => void
}

/**
 * Calls `recompute` once edits have settled for `delayMs`, never twice at the same time.
 * Edits arriving during a recompute trigger one more recompute right after it.
 * `isOutdated()` tells a running recompute that a newer edit arrived,
 * so it can drop its result. `recompute` must handle its own errors.
 */
export default function createRecomputeScheduler(
  delayMs: number,
  recompute: Recompute,
): RecomputeScheduler {
  let timer: ReturnType<typeof setTimeout> | undefined
  let latestChangedField: string | undefined
  let editCount = 0
  let isRecomputing = false
  let needsAnotherRecompute = false
  let isStopped = false

  async function runRecompute() {
    isRecomputing = true
    const editCountAtStart = editCount
    await recompute(
      latestChangedField,
      () => isStopped || editCount !== editCountAtStart,
    )
    isRecomputing = false

    if (needsAnotherRecompute && !isStopped) {
      needsAnotherRecompute = false
      runRecompute()
    }
  }

  return {
    schedule(changedField) {
      editCount += 1
      latestChangedField = changedField
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (isRecomputing) {
          needsAnotherRecompute = true
        } else {
          runRecompute()
        }
      }, delayMs)
    },
    stop() {
      isStopped = true
      clearTimeout(timer)
    },
  }
}
