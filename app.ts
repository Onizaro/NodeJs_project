import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json()); // to parse request body with HTTP header "content-type": "application/json"

// @ts-ignore
const jsDocOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'Documentation for Express API with Swagger',
        },
        components: {
            schemas: {
                Todo: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
                TodoNoId: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['app.ts'],
};

const apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null, 2));

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));

interface Todo {
    id: number;
    title: string;
    description?: string;
}

interface TodoNoId {
    title: string;
    description?: string;
}

let idGenerator = 1;
const todos: Todo[] = [
    { id: idGenerator++, title: 'Learn TypeScript' },
    { id: idGenerator++, title: 'Learn Angular' },
    { id: idGenerator++, title: 'Learn NodeJs' },
    { id: idGenerator++, title: 'Learn Express' },
];

// Utility function to generate new IDs
function newId(): number {
    return idGenerator++;
}

/**
 * @openapi
 * /api/todos:
 *   get:
 *     description: Get all todos
 *     responses:
 *       200:
 *         description: An array of Todo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get('/api/todos', (req: Request, res: Response) => {
    console.log('handle HTTP GET /api/todos');
    res.send(todos);
});

/**
 * @openapi
 * /api/todos:
 *   post:
 *     description: Save a new Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoNoId'
 *     responses:
 *       200:
 *         description: The created Todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
app.post('/api/todos', (req: Request, res: Response) => {
    const item: TodoNoId = req.body;
    console.log('handle HTTP POST /api/todos', item);
    const newTodo: Todo = { id: newId(), ...item };
    todos.push(newTodo);
    res.send(newTodo);
});

/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     description: Get a todo by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested Todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
app.get('/api/todos/:id', (req: Request, res: Response) => {
    const id = Number(req.params['id']);
    console.log('handle HTTP GET /api/todos/:id', id);
    const found = todos.find((todo) => todo.id === id);
    if (found) {
        res.send(found);
    } else {
        res.status(404).send(`Todo entity not found by id: ${id}`);
    }
});

/**
 * @openapi
 * /api/todos:
 *   put:
 *     description: Update an existing Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The updated Todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
app.put('/api/todos', (req: Request, res: Response) => {
    const item: Todo = req.body;
    console.log('handle HTTP PUT /api/todos', item);
    const idx = todos.findIndex((todo) => todo.id === item.id);
    if (idx !== -1) {
        const updatedTodo = { ...todos[idx], ...item };
        todos[idx] = updatedTodo;
        res.send(updatedTodo);
    } else {
        res.status(404).send(`Todo entity not found by id: ${item.id}`);
    }
});

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     description: Delete a Todo by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted Todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
app.delete('/api/todos/:id', (req: Request, res: Response) => {
    const id = Number(req.params['id']);
    console.log('handle HTTP DELETE /api/todos/:id', id);
    const idx = todos.findIndex((todo) => todo.id === id);
    if (idx !== -1) {
        const deletedTodo = todos.splice(idx, 1)[0];
        res.send(deletedTodo);
    } else {
        res.status(404).send(`Todo entity not found by id: ${id}`);
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/swagger-ui`);
});

app.get('/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(apiDoc);
});
