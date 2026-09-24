export type RecomputeQueue<Trigger> = {
  schedule: (trigger?: Trigger) => void
  dispose: () => void
}

/**
 * Debounces recompute requests and runs at most one at a time.
 * Requests arriving while a run is in flight queue a single follow-up run,
 * and `isSuperseded` tells the in-flight run that its result is outdated.
 * `run` must handle its own errors.
 */
export default function createRecomputeQueue<Trigger>(
  delayMs: number,
  run: (
    trigger: Trigger | undefined,
    isSuperseded: () => boolean,
  ) => Promise<void>,
): RecomputeQueue<Trigger> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let generation = 0
  let isRunning = false
  let hasPendingRun = false
  let pendingTrigger: Trigger | undefined
  let isDisposed = false

  function start(trigger: Trigger | undefined) {
    isRunning = true
    const runGeneration = generation
    run(trigger, () => isDisposed || runGeneration !== generation).finally(
      () => {
        isRunning = false
        if (hasPendingRun && !isDisposed) {
          hasPendingRun = false
          start(pendingTrigger)
        }
      },
    )
  }

  return {
    schedule(trigger) {
      generation += 1
      pendingTrigger = trigger
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (isRunning) {
          hasPendingRun = true
        } else {
          start(pendingTrigger)
        }
      }, delayMs)
    },
    dispose() {
      isDisposed = true
      clearTimeout(timeoutId)
    },
  }
}
