const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

// CORSを有効化
app.use(cors());
app.use(express.json());

// 静的ファイルの提供
app.use(express.static('.'));

// Hugging Face APIへのプロキシエンドポイント
app.post('/api/analyze', async (req, res) => {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/rinna/japanese-gpt-neox-3.6b', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 