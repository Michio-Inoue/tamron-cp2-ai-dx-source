from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app, resources={r"/*": {"origins": "*"}})

# 静的ファイルの提供
@app.route('/')
def serve_index():
    return send_from_directory('.', 'ai-drbfm.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory('.', path)
    except Exception as e:
        print(f"ファイル {path} の提供中にエラーが発生しました:", str(e))
        return "File not found", 404

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        print("リクエストデータ:", request.json)
        
        if not request.json or "inputs" not in request.json:
            return jsonify({'error': '無効なリクエストデータです'}), 400
            
        # プロンプトの構築
        prompt = f"""あなたは機械設計の専門家です。以下のDRBFMデータを分析し、設計変更における技術的な考慮点と推奨行動を提案してください。

{request.json["inputs"]}

以下の形式で回答してください：
1. 考慮すべき点：
- 設計変更による具体的な影響
- 品質への具体的な影響
- 製造工程への具体的な影響
- コストへの具体的な影響
- 安全性への具体的な影響

2. 推奨される行動：
- 具体的な検証方法
- 必要な試験項目
- 具体的なリスク対策
- 具体的な品質確認項目
- 製造工程での具体的な確認事項"""

        # ダミーの応答を返す
        response = """1. 考慮すべき点：
- 設計変更による具体的な影響：部品の寸法変更により、組み立て性に影響が出る可能性があります。
- 品質への具体的な影響：材料の変更により、強度特性が変化する可能性があります。
- 製造工程への具体的な影響：加工方法の変更が必要になる可能性があります。
- コストへの具体的な影響：新しい材料の採用により、コストが増加する可能性があります。
- 安全性への具体的な影響：強度の変化により、安全性に影響が出る可能性があります。

2. 推奨される行動：
- 具体的な検証方法：強度計算とFEM解析を実施
- 必要な試験項目：引張試験、疲労試験、環境試験
- 具体的なリスク対策：安全係数の見直しと余裕設計の検討
- 具体的な品質確認項目：寸法精度、表面粗さ、材料特性
- 製造工程での具体的な確認事項：加工精度、組立性、検査方法"""
        
        return jsonify({
            "generated_text": response
        })
        
    except Exception as e:
        print("エラー:", str(e))
        print("エラーの詳細:", traceback.format_exc())
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    print("サーバーを開始します...")
    print("以下のURLでアクセス可能です:")
    print("http://localhost:8080")
    print("http://127.0.0.1:8080")
    app.run(host='0.0.0.0', port=8080, debug=True) 