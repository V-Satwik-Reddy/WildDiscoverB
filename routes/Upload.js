const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const mime = require('mime-types');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { phone, tag } = req.body;
    const file = req.file;

    if (!file || !phone || !tag) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileExt = mime.extension(file.mimetype);
    const fileName = `${tag}_${crypto.randomUUID()}.${fileExt}`;
    const localDir = path.join(__dirname, '..', 'uploads', phone);

    // 🧱 Make sure local dir exists
    fs.mkdirSync(localDir, { recursive: true });

    const localFilePath = path.join(localDir, fileName);

    // 🧾 Write file to disk
    fs.writeFileSync(localFilePath, file.buffer);

    // 🌐 Upload to S3 (your existing logic)
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `uploads/${phone}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/uploads/${phone}/${fileName}`;

    res.json({ success: true, imageUrl, localPath: localFilePath });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload' });
  }
});
module.exports = router;

