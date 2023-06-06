const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: 'doilg1m0l',
    api_key: '433865781989791',
    api_secret: 'SNQa-ftMmEM1jwcvnSStaezr6lU'
});

const app = express();
const upload = multer({ dest: 'uploads/' });

// Endpoint untuk mengunggah gambar
app.post('/upload', upload.fields([
    { name: 'imageKtp', maxCount: 1 },
    { name: 'imageKk', maxCount: 1 }
]),

    async (req, res) => {
        try {
            const { imageKtp, imageKk } = req.files;

            const uploadImage = async (file, fieldName) => {
                const result = await cloudinary.uploader.upload(file[0].path, {
                    folder: 'tes' // Nama folder di Cloudinary
                });
                const imageUrl = result.secure_url;

                // Hapus file lokal setelah diunggah ke Cloudinary
                fs.unlinkSync(file[0].path);

                return { fieldName, imageUrl };
            };

            const [uploadedKtp, uploadedKk] = await Promise.all([
                uploadImage(imageKtp, 'imageKtp'),
                uploadImage(imageKk, 'imageKk')
            ]);

            const urls = {
                [uploadedKtp.fieldName]: uploadedKtp.imageUrl,
                [uploadedKk.fieldName]: uploadedKk.imageUrl
            };

            res.json({ urls });
        } catch (error) {
            console.error('Error uploading images:', error);
            res.status(500).json({ error: 'Failed to upload images' });
        }
    });

// Jalankan server pada port 3100
app.listen(3100, () => {
    console.log('Server listening on port 3100');
});
