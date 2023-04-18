export class Category {
    public id: number; // 自增主键
    public name: string; // 分类名，唯一

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static from(obj: any): Category {
        return new Category(obj.id, obj.name);
    }
}
