export interface SprintJSON {
  id: string
  projectId: string
  name: string
  startDate: string
  endDate: string
  capacityHours: number
}

export class Sprint {
  id: string
  projectId: string
  name: string
  startDate: string
  endDate: string
  capacityHours: number

  constructor(id: string, projectId: string, name: string, startDate: string, endDate: string, capacityHours = 40) {
    this.id = id
    this.projectId = projectId
    this.name = name
    this.startDate = startDate
    this.endDate = endDate
    this.capacityHours = capacityHours
  }

  isActiveOn(date: Date = new Date()): boolean {
    const start = new Date(this.startDate)
    const end = new Date(this.endDate)
    return date >= start && date <= end
  }

  toJSON(): SprintJSON {
    return {
      id: this.id,
      projectId: this.projectId,
      name: this.name,
      startDate: this.startDate,
      endDate: this.endDate,
      capacityHours: this.capacityHours,
    }
  }

  static fromJSON(json: SprintJSON): Sprint {
    return new Sprint(
      json.id,
      json.projectId || 'default-project', 
      json.name,
      json.startDate,
      json.endDate,
      json.capacityHours
    )
  }
}