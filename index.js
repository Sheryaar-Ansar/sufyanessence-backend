require('dotenv').config();
const express = require('express');
const path = require('path')
const connectDB = require('./db/config');
const cookieParser = require('cookie-parser')

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes')
const cartRoutes = require('./routes/cartRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
connectDB();

app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/reviews', express.static(path.join(__dirname, 'uploads')));

app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', reviewRoutes)
app.use('/api', cartRoutes)
app.use('/api', dashboardRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
