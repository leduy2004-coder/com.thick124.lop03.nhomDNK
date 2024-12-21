// routes/account.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { connectToDatabase } = require('../config/dbConfig');
const bcrypt = require('bcrypt')

// Route để đăng nhập khách hàng
router.post('/login', async (req, res) => {
    const { tenTK, matKhau } = req.body;

    try {
        let pool = await connectToDatabase();
        
        // Lấy thông tin người dùng dựa trên tài khoản
        let results = await pool.request()
    .input('tenTK', sql.VarChar, tenTK)
    .query('SELECT * FROM KhachHang WHERE tenTK = @tenTK');

    if (results.recordset.length > 0) {
        const users = results.recordset; // Lấy danh sách tất cả người dùng

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            
            // So sánh mật khẩu nhập vào với mật khẩu đã băm
            const isMatch = await bcrypt.compare(matKhau, user.matKhau);

            if (isMatch) {
                console.log(user)
                return res.json(user); 
            }
        }

        // Nếu không có tài khoản nào khớp
        res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    } else {
        // Không có người dùng trong bảng
        res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    } catch (err) {
        console.error('Lỗi:', err);
        res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu' });
    } 
});
// Route để đăng nhập admin
router.post('/login-admin', async (req, res) => {
    const { tenTK, matKhau } = req.body;
    console.log(tenTK)
    console.log(matKhau)
    try {
        let pool = await connectToDatabase();
        
        // Lấy thông tin người dùng dựa trên tài khoản
        let results = await pool.request()
    .input('tenTK', sql.VarChar, tenTK)
    .input('matKhau', sql.VarChar, matKhau)
    .query('SELECT * FROM QuanLi WHERE tenTK = @tenTK and matKhau = @matKhau');

    if (results.recordset[0]) {  
        console.log(results.recordset[0])
        return res.json(results.recordset[0]); 
    }
    // Không có người dùng trong bảng
     res.status(401).json({ message: "Không tìm thấy người dùng" });
    
    } catch (err) {
        console.error('Lỗi:', err);
        res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu' });
    } 
});
// Route update thông tin admin
router.patch('/update-admin', async (req, res) => {
    const { maQL, hoTen, sdt, ngaySinh, diaChi, cccd, gioiTinh } = req.body;  
    if (!maQL || !hoTen || !ngaySinh ) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để cập nhật' }); 
    }

    try {
        let pool = await connectToDatabase();

        let results = await pool.request()
            .input('maQL', sql.VarChar, maQL)
            .query('SELECT * FROM QuanLi WHERE maQL = @maQL');

        if (results.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với id đã cung cấp' });  
        }

        await pool.request()
            .input('maQL', sql.VarChar, maQL)
            .input('hoTen', sql.NVarChar, hoTen)
            .input('sdt', sql.NVarChar, sdt || null)  
            .input('ngaySinh', sql.Date, ngaySinh) 
            .input('diaChi', sql.NVarChar, diaChi || null)
            .input('cccd', sql.BigInt, cccd || null)
            .input('gioiTinh', sql.Bit, gioiTinh) 
            .query(`
                UPDATE QuanLi
                SET hoTen = @hoTen, sdt = @sdt, ngaySinh = @ngaySinh,
                    diaChi = @diaChi, cccd = @cccd, gioiTinh = @gioiTinh
                WHERE maQL = @maQL
            `);

        return res.json({ message: 'Cập nhật thông tin người dùng thành công' });

    } catch (err) {
        console.error('Lỗi:', err);
        return res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu' });
    }
});

// Route để lấy lịch sử khách hàng
router.get('/history/:maKH', async (req, res) => {
    const maKH = req.params.maKH; // Lấy mã khách hàng từ URL
    try {
        let pool = await connectToDatabase();
        let result = await pool.request()
        
        .input('maKH', sql.VarChar(20), maKH) // Đặt giá trị cho tham số maKH
        .query('SELECT * FROM fLichSuKH(@maKH)'); // Gọi hàm fLichSuKH
        
    res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy lịch sử:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu lịch sử');
    } 
});

module.exports = router;
