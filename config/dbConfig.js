// dbConfig.js
const os = require('os');
const dotenv = require('dotenv');
const sql = require('mssql');
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD, 
    database: process.env.SQL_DATABASE,
    server: process.env.SQL_SERVER,
    port: parseInt(process.env.SQL_PORT),

    options: {
        encrypt: true, // Nếu bạn đang sử dụng Azure, bật tùy chọn này
        trustServerCertificate: true, // Nếu sử dụng self-signed SSL
        enableArithAbort: true,
    },
    pool: {
        max: 10,                  // Giới hạn tối đa kết nối pool
        min: 1,                  // Số kết nối tối thiểu
        idleTimeoutMillis: 120000, // Thời gian chờ cho kết nối không hoạt động
    },
    connectionTimeout: 120000,   // Thời gian chờ kết nối
    requestTimeout: 120000       // Thời gian chờ cho truy vấn
};

// Tạo connection pool duy nhất
let poolPromise;

async function connectToDatabase() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Kết nối đến SQL Server thành công!');
                return pool;
            })
            .catch(err => {
                console.error('Không thể kết nối đến SQL Server:', err.message);
                throw err;
            });
    }
    return poolPromise;
}

// Đảm bảo pool được đóng khi ứng dụng dừng
process.on('exit', async () => {
    try {
        const pool = await poolPromise;
        if (pool) {
            await pool.close();
            console.log('Đã đóng kết nối SQL Server.');
        }
    } catch (err) {
        console.error('Lỗi khi đóng kết nối:', err.message);
    }
});

module.exports = {
    sql,
    connectToDatabase
};
