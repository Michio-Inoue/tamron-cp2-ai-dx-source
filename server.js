const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// CORSを有効化
app.use(cors());
app.use(express.json());

// 静的ファイルの提供
app.use(express.static('.'));

// Gemma APIの初期化
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEYが設定されていません。.envファイルを確認してください。');
    process.exit(1);
}

console.log('Gemma API Key:', process.env.GEMINI_API_KEY ? '設定済み' : '未設定');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI分析エンドポイント
app.post('/api/analyze', async (req, res) => {
    try {
        const { inputs, parameters } = req.body;

        if (!inputs) {
            return res.status(400).json({ error: '入力データが指定されていません。' });
        }

        // Gemini 2.0 Flashモデルの取得
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 生成設定
        const generationConfig = {
            temperature: parameters?.temperature || 0.1,
            maxOutputTokens: parameters?.max_new_tokens || 1024,
            topP: parameters?.top_p || 0.9,
        };

        // テキスト生成
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: inputs }] }],
            generationConfig,
        });

        if (!result || !result.response) {
            throw new Error('Gemini APIからの応答が不正です。');
        }

        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error('生成されたテキストが空です。');
        }

        res.json({ generated_text: text });
    } catch (error) {
        console.error('AI分析エラー:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

// Gemma APIエンドポイント
app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt, temperature, maxOutputTokens } = req.body;

        if (!prompt) {
            console.error('プロンプトが指定されていません');
            return res.status(400).json({ error: 'プロンプトが指定されていません。' });
        }

        console.log('Gemma APIリクエスト:', {
            promptLength: prompt.length,
            temperature,
            maxOutputTokens
        });

        // Gemini 2.0 Flashモデルの取得
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 生成設定
        const generationConfig = {
            temperature: temperature || 0.1,
            maxOutputTokens: maxOutputTokens || 1024,
        };

        console.log('Gemma API呼び出しを開始します');
        // テキスト生成
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        if (!result || !result.response) {
            console.error('Gemma APIからの応答が不正です:', result);
            throw new Error('Gemma APIからの応答が不正です。');
        }

        const response = result.response;
        const text = response.text();

        if (!text) {
            console.error('生成されたテキストが空です');
            throw new Error('生成されたテキストが空です。');
        }

        console.log('Gemma APIレスポンス:', {
            responseLength: text.length,
            firstChars: text.substring(0, 100)
        });

        res.json({ response: text });
    } catch (error) {
        console.error('Gemma API Error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('環境変数:', {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '設定済み' : '未設定',
        PORT: process.env.PORT || 8080
    });
}); 