const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())


app.use(express.json())

const path = require('path');
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


const mongoose = require('mongoose')
const mongoDB = "mongodb+srv://lionessyarush:Gfhjkm18022009@cluster0.othdvv9.mongodb.net/todos?appName=Cluster0"
mongoose.connect(mongoDB)


const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("Database test connected")
})

// scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true }
})

// model
const Todo = mongoose.model('Todo', todoSchema, 'todos')


function checkTodoIsOk(todoText) {
    return typeof todoText === 'string' && todoText.trim() !== '';
}


app.listen(port, () => {
    console.log('app listening on port 3000')
})



app.post('/todos', async (request, response) => {
    const { text } = request.body
    if (!checkTodoIsOk(text))
        return response.status(400).json({ error: 'Tehtävä ei voi olla tyhjä!' });
    const todo = new Todo({
        text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)
})

app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})
app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

app.delete('/todos/:id', async (request, response) => {
    const doc = await Todo.findById(request.params.id);
    if (doc) {
        await doc.deleteOne()
        response.json(doc)
    }
    else response.status(404).end()
})

// Put-reitti lisätty, osa 2
app.put('/todos/:id', async (request, response) => {
   
    const { text } = request.body;
    if (!checkTodoIsOk(text))
        return response.status(400).json({ error: 'Tehtävä ei voi olla tyhjä!' });

    const todo = {
        text: text
    };

    
    const filter = { _id: request.params.id }; 
    const updatedTodo = await Todo.findOneAndUpdate(filter, todo, {
        new: true
    });

    if (!updatedTodo) {
        return response.status(404).json({ error: 'Tehtävää ei löytynyt.' });
    }

    response.json(updatedTodo);
});
