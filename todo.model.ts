export interface TodoDTO {
    id: number;
    title: string;
    description?: string;
    priority?: number;
}

export class TodoModel {
    id: number;
    title: string;
    description: string;
    priority: number;

    constructor(src: TodoDTO) {
        this.id = src.id || -1;
        this.title = src.title || '';
        this.description = src.description || '';
        this.priority = src.priority || 1;
    }
}
