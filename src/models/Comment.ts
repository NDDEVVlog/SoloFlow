export interface CommentJSON {
  id: string
  author: string
  text: string
  createdAt: string
}

/** One entry in a Task's activity/comment log. Kept immutable once posted. */
export class Comment {
  id: string
  author: string
  text: string
  createdAt: string

  constructor(id: string, author: string, text: string, createdAt: string = new Date().toISOString()) {
    this.id = id
    this.author = author
    this.text = text
    this.createdAt = createdAt
  }

  toJSON(): CommentJSON {
    return { id: this.id, author: this.author, text: this.text, createdAt: this.createdAt }
  }

  static fromJSON(json: CommentJSON): Comment {
    return new Comment(json.id, json.author, json.text, json.createdAt)
  }
}
