# Simple To-Do App (Very Easy Guide)

This is a small app where you can:
- add a task
- edit a task
- delete a task
- see all tasks

Think of it like a digital paper list.

## What you need before starting

1. Install [Node.js](https://nodejs.org/) (LTS version is best).
2. Have a MongoDB database (local or MongoDB Atlas).

## Step-by-step setup

1. Open this project folder in a terminal.
2. Install packages:

```bash
npm install
```

3. Create a file named `.env` in the project root (if it does not exist).
4. Put your MongoDB connection string inside:

```env
mongoDB=YOUR_MONGODB_CONNECTION_STRING
```

Example:
- `mongodb://127.0.0.1:27017/todo`
- or an Atlas URL like `mongodb+srv://...`

5. Start the server:

```bash
npm start
```

You should see a message in terminal that the app is listening on port `3000`.

## Open the app

Open `index.html` in your browser.

If double-click does not work well, run it with a simple local web server (for example VS Code Live Server), then open that URL in your browser.

## How to use

1. Type your task in the input box.
2. Click **Add**.
3. To edit, click **Muokkaa** (means "Edit"), change text, then click **Tallenna** (means "Save").
4. To delete, click **x**.

## API (for developers)

Base URL: `http://localhost:3000`

- `GET /todos` - get all tasks
- `POST /todos` - create task (`{ "text": "Buy milk" }`)
- `GET /todos/:id` - get one task
- `PUT /todos/:id` - update task (`{ "text": "New text" }`)
- `DELETE /todos/:id` - delete task

## If something is not working

- Check that MongoDB is running and connection string in `.env` is correct.
- Check server terminal for errors.
- Make sure port `3000` is free.
- Restart server after changing `.env`.
