const express = require('express');
const app = express();
const mwLogger = require('./middlewares/logger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRouter = require('./routes/products/routes');
const userRouter = require('./routes/users/routes');
const cors = require('cors');
dotenv.config();
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions)); 
mongoose.connect(process.env.MDB_CONN_STR,{
    dbName:'mongodemo'
});

mongoose.connection.on('connected', () => console.log('Database connected!'));
mongoose.connection.on('disconnected', () => console.log('Database disconnected!'));
mongoose.connection.on('error', (err) => console.log(`Database error ${err}`));

app.use(express.json());

// Register middleware with the app instance
app.use(mwLogger);

// Route registration for all /users routes
app.use('/users', userRouter);

// Route registration for all /products routes
app.use('/products', productRouter);

// Route registration for all /orders routes
// app.use('/orders', orderRoutes);

// root route endpoint
app.get('/',(req,res) => {
    res.send("Root endpoint!");
});

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
})

// Defailt catch all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

process.on('SIGINT', () => {
    console.log("SIGINT");
    mongoose.disconnect();
    console.log("TERMINATED");
});