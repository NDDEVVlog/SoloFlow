export interface SprintJSON {
  id: string
  name: string
  startDate: string
  endDate: string
  capacityHours: number
}

/**
 * A time-boxed work period ("Tuần 1", "Sprint 3"...). Capacity defaults to
 * 40h/week to match the Overload Indicator's threshold, but is editable per
 * sprint so a short week or a crunch week can carry a different cap.
 */
export class Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  capacityHours: number

  constructor(id: string, name: string, startDate: string, endDate: string, capacityHours = 40) {
    this.id = id
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
      name: this.name,
      startDate: this.startDate,
      endDate: this.endDate,
      capacityHours: this.capacityHours,
    }
  }

  static fromJSON(json: SprintJSON): Sprint {
    return new Sprint(json.id, json.name, json.startDate, json.endDate, json.capacityHours)
  }
}
