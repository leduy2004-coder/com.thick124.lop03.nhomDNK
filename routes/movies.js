// routes/movies.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const sql = require('mssql');
const { connectToDatabase } = require('../config/dbConfig');
const axiosRetry = require('axios-retry');
const { uploadImage, uploadMultipleImages, deleteImage } = require('../utils/uploadImage');
const multer = require('multer');

// Hàm để lấy chi tiết của từng phim với retry và timeout
const fetchMovieDetails = async (movies) => {
    const movieDetailsPromises = movies.map(async (movie) => {
        try {
            const movieResponse = await axios.get(`http://localhost:3000/movies/phim/${movie.maPhim}`);
            return movieResponse.data;
        } catch (err) {
            console.error(`Lỗi khi lấy thông tin phim ${movie.maPhim}:`, err.message);
            return null; // Trả về null nếu có lỗi
        }
    });

    return await Promise.all(movieDetailsPromises);
};

const fetchMovieDetailsSequential = async (movies) => {
    const movieDetails = [];
    for (const movie of movies) {
        try {
            const movieResponse = await axios.get(`http://localhost:3000/movies/phim/${movie.maPhim}`);
            movieDetails.push(movieResponse.data);
        } catch (err) {
            console.error(`Lỗi khi lấy thông tin phim ${movie.maPhim}:`, err.message);
        }
    }
    return movieDetails;
};


// Route để lấy tất cả phim 
router.get('/getAll', async (req, res) => {
    let pool;

    try {
        pool = await connectToDatabase();

        let result = await pool.request()
            .query('SELECT maPhim, tenPhim, thoiLuong, hinhDaiDien from Phim'); 

        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu phim chiếu:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu phim chiếu');
    } 
});
// Route để lấy những phim đang chiếu
router.get('/phimdangchieu', async (req, res) => {
    let pool;

    try {
        pool = await connectToDatabase();

        // Lấy danh sách maPhim từ stored procedure GetSuatChieu
        let result = await pool.request().execute('GetSuatChieu');

        // Lấy thông tin chi tiết của các phim
        const movieDetails = await fetchMovieDetailsSequential(result.recordset);

        // Trả về danh sách thông tin chi tiết của các phim
        res.json(movieDetails.filter(movie => movie !== null));
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu phim đang chiếu:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu phim đang chiếu');
    } 
});

// Route để lấy những phim chưa chiếu
router.get('/phimchuachieu', async (req, res) => {
    let pool;

    try {
        pool = await connectToDatabase();

        // Lấy danh sách maPhim từ stored procedure GetSuatChuaChieu
        let result = await pool.request().execute('GetSuatChuaChieu');

        // Lấy thông tin chi tiết của các phim
        const movieDetails = await fetchMovieDetails(result.recordset);

        // Trả về danh sách thông tin chi tiết của các phim
        res.json(movieDetails.filter(movie => movie !== null));
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu phim chưa chiếu:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu phim chưa chiếu');
    }
});

// Route để lấy những ngày đang chiếu
router.get('/ngaydangchieu', async (req, res) => {
    let pool;

    try {
        pool = await connectToDatabase();

        // Lấy danh sách maPhim từ stored procedure GetSuatChieu
        let result = await pool.request().execute('GetNgayChieu');

        const data = result.recordset;
        // Trả về danh sách thông tin chi tiết của các phim
        console.log('data442424224244242')

        console.log(data)
        res.json(data);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu phim đang chiếu ppp:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu phim đang chiếu');
    } 
});
// Route để lấy tất cả loại phim
router.get('/getTypeMovie', async (req, res) => {
    let pool;

    try {
        pool = await connectToDatabase();

        // Lấy danh sách maPhim từ stored procedure GetSuatChieu
        let result = await pool.request()
            .query('SELECT * FROM TheLoaiPhim');

        const data = result.recordset;
        res.json(data);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu loại phim:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu loại phim');
    } 
});

// Route để lấy loại phim dựa vào mã phim
router.get('/getGenreByMovie/:maPhim', async (req, res) => {
    const { maPhim } = req.params;
    let pool;
    try {
        // Kết nối với cơ sở dữ liệu
        pool = await connectToDatabase();

        // Thực thi truy vấn SQL
        const result = await pool.request()
            .input('maPhim', sql.VarChar(20), maPhim) // Tham số đầu vào
            .query(`
                SELECT tlp.maLPhim, tlp.tenLPhim, tlp.moTaLP
                FROM Phim p
                JOIN TheLoaiPhim tlp ON p.maLPhim = tlp.maLPhim
                WHERE p.maPhim = @maPhim
            `);

        // Trả về kết quả nếu tìm thấy
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Không tìm thấy loại phim cho mã phim này.');
        }
    } catch (error) {
        console.error('Lỗi khi truy vấn:', error);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.');
    }
});
// Route để lấy thông tin của phim thông qua maPhim
router.get('/phim/:maPhim', async (req, res) => {
    const { maPhim } = req.params; // Lấy mã phim từ URL
    let pool;
    try {
        pool = await connectToDatabase();
        let result = await pool.request()
            .input('maPhim', sql.NVarChar, maPhim)
            .query('SELECT * FROM Phim WHERE maPhim = @maPhim');
           
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Trả về thông tin chi tiết của phim
        } else {
            res.status(404).send('Phim không tìm thấy');
        }
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu phim:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu phim');
    }
});


router.delete('/delete/:idMovie', async (req, res) => {
    const { idMovie } = req.params; 
    let pool;
    
    try {
        pool = await connectToDatabase();
        
        // Lấy thông tin phim trước khi xóa để lấy ảnh
        const movieResult = await pool.request()
            .input('maPhim', sql.NVarChar, idMovie)
            .query('SELECT hinhDaiDien FROM Phim WHERE maPhim = @maPhim');
        
        if (movieResult.recordset.length === 0) {
            return res.status(404).send('Phim không tìm thấy');
        }

        const movie = movieResult.recordset[0];
        const imageUrl = movie.hinhDaiDien;

        // Xóa ảnh trên Cloudinary nếu có
        if (imageUrl) {
            await deleteImage(imageUrl);  
        }

        // Xóa phim trong cơ sở dữ liệu
        const result = await pool.request()
            .input('maPhim', sql.NVarChar, idMovie)
            .query('DELETE FROM Phim WHERE maPhim = @maPhim');

        if (result.rowsAffected[0] > 0) {
            res.status(200).send('Xóa phim thành công');
        } else {
            res.status(404).send('Phim không tìm thấy');
        }
        
    } catch (err) {
        console.log('Lỗi khi xóa dữ liệu phim:', err);
        res.status(500).send('Lỗi khi xóa dữ liệu phim');
    }
});

// Route để lấy ngay chieu cua phim
router.get('/ngaychieu/:maPhim', async (req, res) => {
    const maPhim = req.params.maPhim; // Lấy maPhim từ URL
    let pool;
    try {
        // Kết nối SQL
        pool = await connectToDatabase();

        // Gọi hàm fXuatNgayChieu với tham số maPhim
        let result = await pool.request()
            .input('id', sql.NVarChar(50), maPhim) // Truyền maPhim vào hàm fXuatNgayChieu
            .query('SELECT * FROM fXuatNgayChieu(@id)'); // Gọi hàm SQL

        const ngayChieuList = result.recordset.map(item => {
            return {
                ngayChieu: item.ngayChieu.toISOString().split('T')[0] // Chỉ lấy ngày tháng năm
            };
        });
        // Trả về dữ liệu dạng JSON
        res.json(ngayChieuList);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu ngày chiếu:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu ngày chiếu');
    } 

});

// Route để lấy thông tin của phim thông qua ngày chiếu
router.get('/get-movie-by-date', async (req, res) => {

    const ngay = req.query.ngay;
    const formattedDate = convertDateFormat(ngay);

    let pool;
    try {
        pool = await connectToDatabase();
        
        let result = await pool.request()
            .input('ngay', sql.NVarChar(50), formattedDate) 
            .query('SELECT * FROM fXuatPhimChieu(@ngay)'); 
        // Lấy thông tin chi tiết của các phim
        const movieDetails = await fetchMovieDetailsSequential(result.recordset);

        res.json(movieDetails.filter(movie => movie !== null));
  
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu phim:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu phim');
    } 
});
function convertDateFormat(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}
router.get('/get-schedule/:id', async (req, res) => {
    const phimId = req.params.id;
    let pool;
    try {
        pool = await connectToDatabase();
        // Truy vấn để lấy ngày chiếu
        let result = await pool.request()
            .input('id', sql.NVarChar(50), phimId) // Truyền phimId vào hàm fXuatNgayChieu
            .query('SELECT * FROM fXuatNgayChieu(@id)'); // Gọi hàm SQL

        const ngayChieuList = result.recordset.map(item => {
            return {
                ngayChieu: item.ngayChieu.toISOString().split('T')[0] // Chỉ lấy ngày tháng năm
            };
        });
        // Tạo mảng kết quả
        const schedules = [];

        // Lặp qua từng ngày chiếu để lấy thời gian chiếu
        for (const { ngayChieu } of ngayChieuList) {

            
            const resultThoiGianChieu = await pool.request()
                .input('id', sql.NVarChar, phimId)
                .input('ngayChieu', sql.Date, ngayChieu)
                .query(`
                    SELECT DISTINCT thoiGianBatDau, maCa, maSuat
                    FROM dbo.fXuatThoiGianChieu(@id, @ngayChieu)
                    ORDER BY thoiGianBatDau
                `);
        
            schedules.push({
                ngayChieu: ngayChieu,
                caChieu: resultThoiGianChieu.recordset.map(thoiGian => {
                    return {
                        thoiGianBatDau: thoiGian.thoiGianBatDau.toISOString().split('T')[1].split('.')[0],
                        maCa: thoiGian.maCa,
                        maSuat: thoiGian.maSuat
                    };
                })
            });
        }
        
        console.log("ket qua cuoi cung: ");
        console.log(schedules);

        // Trả về kết quả JSON
        res.json(schedules);
    } catch (error) {
        console.error('Lỗi khi truy vấn:', error);
        res.status(500).send('Đã xảy ra lỗi.');
    }
});

router.get('/get-date-schedule/:id', async (req, res) => {
    const phimId = req.params.id;
    let pool;
    try {
        pool = await connectToDatabase();
        // Truy vấn để lấy ngày chiếu
        let result = await pool.request()
            .input('id', sql.NVarChar(50), phimId) // Truyền phimId vào hàm fXuatNgayChieu
            .query('SELECT * FROM fXuatNgayChieu(@id)'); // Gọi hàm SQL

        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi truy vấn:', error);
        res.status(500).send('Đã xảy ra lỗi.');
    } 
});
router.get('/ticket-details/:maBook', async (req, res) => {
    const maBook = req.params.maBook; // Lấy mã đặt vé từ URL
    let pool;
    try {
        pool = await connectToDatabase();
        let result = await pool.request()
            .input('maBook', sql.VarChar(20), maBook) // Đặt giá trị cho tham số maBook
            .query('SELECT * FROM fChiTietTicket(@maBook)'); // Gọi hàm fChiTietTicket

        // Kiểm tra nếu không có dữ liệu
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin vé' });
        }

        res.json(result.recordset); // Trả về dữ liệu
    } catch (err) {
        console.error('Lỗi khi lấy chi tiết vé:', err);
        res.status(500).send('Lỗi khi lấy dữ liệu chi tiết vé');
    }
});


// Cấu hình Multer để nhận tệp mà không lưu trữ
const storage = multer.memoryStorage();  // Lưu tệp vào bộ nhớ (RAM) thay vì trên đĩa
const upload = multer({ storage: storage });

router.post('/insert', upload.single('movieImage'), async  (req, res) => {
    const { movieTitle, director, ageRequirement, releaseDate, duration, movieType, description, movieVideo, status } = req.body;
    const file = req.file;
    let pool;

    try {
        pool = await connectToDatabase();

        // Kiểm tra dữ liệu đầu vào
        if (!movieTitle || !director || !ageRequirement || !releaseDate || !duration || !movieType) {
            return res.status(400).json({ message: 'Dữ liệu không đầy đủ, vui lòng kiểm tra lại' });
        }

        let imageUrl = null;
        if (file) {
            const uploadResult = await uploadImage(file.buffer);
            imageUrl = uploadResult.secure_url; 
        }

        // Thực hiện câu lệnh INSERT vào cơ sở dữ liệu
        const result = await pool.request()
            .input('tenPhim', sql.NVarChar(50), movieTitle)
            .input('daoDien', sql.NVarChar(50), director)
            .input('doTuoiYeuCau', sql.Int, ageRequirement)
            .input('ngayKhoiChieu', sql.Date, releaseDate)
            .input('thoiLuong', sql.Int, duration)
            .input('maLPhim', sql.VarChar(20), movieType)
            .input('tinhTrang', sql.Int, 1)
            .input('moTa', sql.NVarChar(sql.MAX), description)
            .input('video', sql.NVarChar(sql.MAX), movieVideo)
            .input('hinhDaiDien', sql.NVarChar(sql.MAX), imageUrl) // Lưu URL ảnh
            .query(`
                INSERT INTO Phim 
                (tenPhim, daoDien, doTuoiYeuCau, ngayKhoiChieu, thoiLuong, maLPhim, moTa, video, hinhDaiDien, tinhTrang)
                VALUES 
                (@tenPhim, @daoDien, @doTuoiYeuCau, @ngayKhoiChieu, @thoiLuong, @maLPhim, @moTa, @video, @hinhDaiDien, @tinhTrang);

            `);
        const movieId = result.recordset[0].maPhim; 
        
        const updatedMovie = await pool.request()
        .input('maPhim', sql.NVarChar(50), movieId)
        .query(`
            SELECT * 
            FROM Phim 
            WHERE maPhim = @maPhim
        `);
    // Trả về thông tin phim đã cập nhật
    res.json(updatedMovie.recordset[0]);


    } catch (err) {
        console.error('Lỗi khi chèn dữ liệu:', err);
        res.status(500).json({ message: 'Lỗi khi chèn dữ liệu vào cơ sở dữ liệu', error: err.message });
    }
});
router.patch('/update-movie/:idMovie', upload.single('movieImage'), async (req, res) => {
    const maPhim = req.params.idMovie; 
    const { movieTitle, director, ageRequirement, releaseDate, duration, movieType, description, movieVideo, status } = req.body;
    const file = req.file;
    let pool;

    try {
        pool = await connectToDatabase();

        // Kiểm tra dữ liệu đầu vào
        if (!movieTitle || !director || !ageRequirement || !releaseDate || !duration || !movieType) {
            return res.status(400).json({ message: 'Dữ liệu không đầy đủ, vui lòng kiểm tra lại' });
        }

        // Lấy thông tin chi tiết của bộ phim theo ID
        const result = await pool.request()
            .input('maPhim', sql.VarChar(50), maPhim)
            .query(`
                SELECT * FROM Phim WHERE maPhim = @maPhim
            `);

        const movie = result.recordset[0]; 

        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy bộ phim với ID này' });
        }

        let imageUrl = movie.hinhDaiDien;
        if (file) {
            await deleteImage(imageUrl);  
            const uploadResult = await uploadImage(file.buffer);
            imageUrl = uploadResult.secure_url; 
        }

        // Thực hiện câu lệnh UPDATE vào cơ sở dữ liệu
        await pool.request()
            .input('maPhim', sql.NVarChar(50), maPhim)
            .input('tenPhim', sql.NVarChar(50), movieTitle || movie.tenPhim) 
            .input('daoDien', sql.NVarChar(50), director || movie.daoDien)
            .input('doTuoiYeuCau', sql.Int, ageRequirement || movie.doTuoiYeuCau)
            .input('ngayKhoiChieu', sql.Date, releaseDate || movie.ngayKhoiChieu)
            .input('thoiLuong', sql.Int, duration || movie.thoiLuong)
            .input('maLPhim', sql.VarChar(20), movieType || movie.maLPhim)
            .input('tinhTrang', sql.Bit, status)
            .input('moTa', sql.NVarChar(sql.MAX), description || movie.moTa)
            .input('video', sql.NVarChar(sql.MAX), movieVideo || movie.video)
            .input('hinhDaiDien', sql.NVarChar(sql.MAX), imageUrl)
            .query(`
                UPDATE Phim
                SET 
                    tenPhim = @tenPhim,
                    daoDien = @daoDien,
                    doTuoiYeuCau = @doTuoiYeuCau,
                    ngayKhoiChieu = @ngayKhoiChieu,
                    thoiLuong = @thoiLuong,
                    maLPhim = @maLPhim,
                    moTa = @moTa,
                    video = @video,
                    hinhDaiDien = @hinhDaiDien
                WHERE maPhim = @maPhim
            `);


            // Lấy thông tin phim vừa cập nhật
        const updatedMovie = await pool.request()
        .input('maPhim', sql.NVarChar(50), maPhim)
        .query(`
            SELECT * 
            FROM Phim 
            WHERE maPhim = @maPhim
        `);

    // Trả về thông tin phim đã cập nhật
    res.json(updatedMovie.recordset[0]);
    } catch (err) {
        console.log('Lỗi khi cập nhật dữ liệu:', err);
        res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu vào cơ sở dữ liệu', error: err.message });
    }
});



module.exports = router;
