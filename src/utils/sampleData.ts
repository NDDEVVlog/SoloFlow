import { Sprint, Task } from '@/models'

/**
 * The three seed tasks from the project brief, plus one sprint ("Tuần 1")
 * to hang them on. Loaded once on first run (see useTaskStore#seedIfEmpty)
 * so a fresh clone of the repo already demonstrates every feature.
 */
export function buildSampleData(): { tasks: Task[]; sprints: Sprint[] } {
  const sprint1 = new Sprint('SPR-001', 'Tuần 1', todayMinus(2), todayPlus(4), 40)

  const t1 = new Task({
    id: 'TSK-001',
    name: 'Tối ưu Asset Size',
    role: 'UI/UX',
    type: 'Task',
    priority: 'Low',
    status: 'Todo',
    estHours: 2,
    actualHours: 0,
    sprintId: sprint1.id,
  })
  t1.checklist.addItem('Gom ảnh', () => 'CI-1')
  t1.checklist.addItem('Nén TinyPNG', () => 'CI-2')

  const t2 = new Task({
    id: 'TSK-002',
    name: 'Fix Exit Game Popup',
    role: 'Developer',
    type: 'Bug',
    priority: 'High',
    status: 'Done',
    estHours: 0.5,
    actualHours: 1,
    sprintId: sprint1.id,
  })
  t2.checklist.addItem('Check logic tắt', () => 'CI-3')
  t2.checklist.addItem('Sửa lỗi memory leak', () => 'CI-4')
  t2.checklist.toggleItem('CI-3')
  t2.checklist.toggleItem('CI-4')

  const t3 = new Task({
    id: 'TSK-003',
    name: 'Cân bằng Drop rate',
    role: 'Game Design',
    type: 'Task',
    priority: 'Medium',
    status: 'In Progress',
    estHours: 1.5,
    actualHours: 0,
    sprintId: sprint1.id,
  })
  t3.checklist.addItem('Tải file Sheet', () => 'CI-5')
  t3.checklist.addItem('Sửa tỷ lệ rớt vàng', () => 'CI-6')
  t3.checklist.addItem('Test ingame', () => 'CI-7')
  t3.checklist.toggleItem('CI-5')

  return { tasks: [t1, t2, t3], sprints: [sprint1] }
}

function todayMinus(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}
function todayPlus(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
