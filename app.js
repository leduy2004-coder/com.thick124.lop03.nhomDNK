const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dotenv = require('dotenv');

// Tải biến môi trường
dotenv.config();

app.use(cors());

// Middleware để parse JSON
app.use(express.json());

// Import route
const moviesRoute = require('./routes/movies');
const accountRoute = require('./routes/account');
const bookRoute = require('./routes/book');
const movieTicketRoute = require('./routes/movie_ticket');
const emailRoute = require('./routes/email');
const uploadImage = require('./routes/image');
const voucher = require('./routes/voucher');
const comment = require('./routes/comment');
const customer = require('./routes/customer');
const statistic = require('./routes/statistic');
const schedule = require('./routes/schedule');
// Sử dụng route
app.use('/movies', moviesRoute);
app.use('/book', bookRoute);
app.use('/movie-tickets', movieTicketRoute);
app.use('/email', emailRoute);
app.use('/account', accountRoute);
app.use('/image', uploadImage);
app.use('/comment', comment);
app.use('/voucher', voucher);
app.use('/customer', customer);
app.use('/statistic', statistic);
app.use('/schedule', schedule);

// Định tuyến API
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API Node.js!');
});

// Khởi động server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
