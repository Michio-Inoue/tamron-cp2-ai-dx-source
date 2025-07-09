const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// ミドルウェアの設定
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ルートエンドポイント
app.get('/', (req, res) => {
    res.json({ message: 'AI-DRBFM Analysis Server' });
});

// AI分析エンドポイント
app.post('/api/analyze', (req, res) => {
    try {
        const { designChanges, currentDesign, targetDesign } = req.body;
        
        // ここにAI分析ロジックを実装
        const analysis = {
            risks: [
                {
                    category: '構造的影響',
                    description: '強度低下の可能性',
                    severity: 'HIGH',
                    recommendations: ['応力解析の実施', '材料強度の再確認']
                },
                // 他のリスク項目
            ],
            recommendations: [
                '設計レビューの実施',
                '試作評価の検討',
                'FEA解析による検証'
            ],
            confidence: 0.85
        };

        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: '分析中にエラーが発生しました' });
    }
});

// テンプレート取得エンドポイント
app.get('/api/templates', (req, res) => {
    const templates = [
        {
            id: 1,
            name: '構造変更テンプレート',
            categories: ['構造', '強度', '耐久性']
        },
        {
            id: 2,
            name: '材料変更テンプレート',
            categories: ['材料特性', '環境影響', 'コスト']
        }
    ];
    res.json(templates);
});

// 分析結果保存エンドポイント
app.post('/api/save', (req, res) => {
    try {
        const analysisResult = req.body;
        // ここに保存ロジックを実装
        res.json({ message: '分析結果が保存されました', id: Date.now() });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: '保存中にエラーが発生しました' });
    }
});

// サーバーの起動
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 