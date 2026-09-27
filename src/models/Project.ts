import { shortId } from '@/utils/id'

export interface ProjectJSON {
  id: string
  name: string
  description: string
  createdAt: string
}

export class Project {
  id: string
  name: string
  description: string
  createdAt: string

  constructor(id: string, name: string, description: string = '') {
    this.id = id
    this.name = name
    this.description = description
    this.createdAt = new Date().toISOString()
  }

  toJSON(): ProjectJSON {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
    }
  }

  static fromJSON(json: ProjectJSON | { id: string; name: string }): Project {
    const proj = new Project(json.id, json.name, 'description' in json ? json.description : '')
    if ('createdAt' in json) proj.createdAt = json.createdAt
    return proj
  }
}