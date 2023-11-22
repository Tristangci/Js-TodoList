const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/user');
const todosRoutes = require('./routes/todos/todos');
const registerRoutes = require('./routes/auth/register');
const loginRoutes = require('./routes/auth/login');
const authMiddleware = require('./middleware/auth');
const notfoundRoutes = require('./middleware/notFound');


require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);

app.use(authMiddleware);
app.use('/', notfoundRoutes);
app.use('/user', userRoutes);
app.use('/todos', todosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
