export class Todo {
  public id: number;
  public time: string;
  public done: boolean;
  public title: string;
  public description: string;

  constructor(
    id: number,
    time: string,
    done: boolean,
    title: string,
    description: string,
  ) {
    this.id = id;
    this.title = title;
    this.done = done;
    this.description = description;
    this.time = time;
  }

  static from(obj: any): Todo {
    const {id, title, done, description, time} = obj;
    return new Todo(id, time, done, title, description);
  }
}
