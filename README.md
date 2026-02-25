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

## Download a repo from git

You can do it by running "git clone https://github.com/Fuokushi/todo" in your terminal or u can download a zip package.


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

## Deploy to Render.com (easy way)

### Before cloud deploy (important)

Make these small code changes first:

1. In `index.js`, use:
   - `const port = process.env.PORT || 3000`
   - `const mongoDB = process.env.mongoDB`
2. In `code.js`, use:
   - `const API_URL = '/todos';`

Why: in cloud hosting, `localhost` in browser is not your server.

### Steps

1. Push your project to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New** -> **Web Service**.
4. Connect your GitHub repo.
5. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variable:
   - `mongoDB=YOUR_MONGODB_CONNECTION_STRING`
7. Click **Create Web Service** and wait for deploy.
8. Open your `https://...onrender.com` URL.

## Deploy to AWS Academy Linux (EC2 + sudo)

If your lab gives you a Linux VM/EC2 instance, use this method.

### 1) Connect to your server

Use SSH from your local machine (example):

```bash
ssh -i your-key.pem ec2-user@YOUR_PUBLIC_IP
```

If your username is different (for example `ubuntu`), use that username.

### 2) Install Node.js, Git, and PM2

Run these commands on the server.

For Amazon Linux:

```bash
sudo dnf update -y
sudo dnf install -y git nodejs npm
sudo npm install -g pm2
```

For Ubuntu:

```bash
sudo apt update
sudo apt install -y git nodejs npm
sudo npm install -g pm2
```

### 3) Download and configure app

```bash
git clone https://github.com/Fuokushi/todo.git
cd todo
npm install
```

Create `.env`:

```bash
nano .env
```

Put this inside:

```env
mongoDB=YOUR_MONGODB_CONNECTION_STRING
```

### 4) Start app in background

```bash
pm2 start index.js --name todo-app
pm2 save
pm2 startup
```

Run the command shown by `pm2 startup` (it usually starts with `sudo`).

### 5) Open port in Security Group

In AWS Console -> EC2 -> Security Groups:
- allow inbound `3000` from your IP (or `0.0.0.0/0` for testing only)

Then open:
- `http://YOUR_PUBLIC_IP:3000`

### Useful commands later

- Check app logs: `pm2 logs todo-app`
- Restart app: `pm2 restart todo-app`
- Stop app: `pm2 stop todo-app`
