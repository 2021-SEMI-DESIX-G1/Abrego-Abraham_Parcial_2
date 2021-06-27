const express = require('express');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

const Data = [
    {
        name: 'Terminar clase de metodologías',
        type: 'Universidad',
        completed: true
    },
    {
        name: 'Hacer laboratorio de programación',
        type: 'Hogar',
        completed: false
    },
]

const Tasks = {
    getTasks: (req, res) => {
        res.json({
            model: 'Tasks',
            count: Data.length,
            data: Data,
        });
    },
    getTask: (req, res) => {
        res.json(Data[req.params.id]);
    },
    createTask: (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){ return res.json({msg: 'Error al agregar tarea'});}
        const { name, type, completed } = req.body;
        Data.push({ name, type, completed });
        res.json({msg: 'Tarea agregada'});
    },
    deleteTask: (req, res) => {
        Data.splice(req.params.id, 1); //elimina un elemento en la posicion del id obtenido
        res.json({msg: 'Tarea eliminada'});
    },
    updateTask: (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){ return res.json('Error al confirmar la tarea');}
        Data[req.params.id] = req.body;
        res.json({msg: 'Tarea actualizada'});
    },
}

const TasksValidations = {
    createTask: [
        body('name', 'El nombre de la tarea es incorrecto.').exists({checkNull: true, checkFalsy: true}),
        body('completed', 'error al confirmar tarea.').isBoolean(),
    ]
}

app.get('/api/v1/tasks/', Tasks.getTasks);
app.get('/api/v1/task/:id', Tasks.getTask);
app.post('/api/v1/tasks/', TasksValidations.createTask, Tasks.createTask);
app.delete('/api/v1/tasks/delete/:id', Tasks.deleteTask);
app.patch('/api/v1/tasks/update/:id', Tasks.updateTask);

app.listen(port, () => {
    console.log(`Ejemplo escuchando en: http://localhost:${port}`)
})