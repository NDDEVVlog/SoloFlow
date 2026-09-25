/**
 * Sequential, human-readable IDs (TSK-001, TSK-002, ...) instead of UUIDs —
 * matches the spec's "Task ID: TSK-001, auto-generated" requirement and
 * stays sortable/legible in a table. `nextTaskId` looks at the *current*
 * task list so it stays correct even after deletions.
 */
export function nextTaskId(existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => {
      const match = /^TSK-(\d+)$/.exec(id)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((n) => !Number.isNaN(n))
  const max = numbers.length ? Math.max(...numbers) : 0
  return `TSK-${String(max + 1).padStart(3, '0')}`
}

let counter = 0
/** Short random-ish id for sub-entities (checklist items, comments, sprints) that don't need the TSK- scheme. */
export function shortId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}${counter.toString(36)}`
}
