// ファイルアップロード関連の処理
document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('fileInput');
    const progressSection = document.getElementById('progressSection');
    const resultSection = document.getElementById('resultSection');

    // クリックでファイル選択を開く
    fileUpload.addEventListener('click', () => {
        fileInput.click();
    });

    // ファイル選択時の処理
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files);
            // 選択後のUI更新
            updateUploadUI(files);
        }
    });

    // ドラッグ&ドロップの処理
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUpload.classList.add('border-primary');
    });

    fileUpload.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUpload.classList.remove('border-primary');
    });

    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUpload.classList.remove('border-primary');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
            // ドロップ後のUI更新
            updateUploadUI(files);
        }
    });
});

// UI更新関数
function updateUploadUI(files) {
    const fileUpload = document.getElementById('fileUpload');
    const fileList = Array.from(files).map(f => f.name).join(', ');
    
    // アイコンを変更
    const icon = fileUpload.querySelector('i');
    icon.className = 'fas fa-check-circle fa-3x mb-3 text-success';
    
    // テキストを更新
    const heading = fileUpload.querySelector('h4');
    heading.textContent = 'ファイルが選択されました';
    
    // ファイル名を表示
    const text = fileUpload.querySelector('p');
    text.textContent = `選択されたファイル: ${fileList}`;
}

// ファイル処理
function handleFiles(files) {
    if (files.length === 0) return;
    
    const fileList = Array.from(files);
    console.log('Selected files:', fileList.map(f => f.name));
    
    // ファイルの種類をチェック
    const validFiles = fileList.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py'].includes(ext);
    });

    if (validFiles.length === 0) {
        showError('サポートされているファイル形式をアップロードしてください。');
        return;
    }

    // ファイル読み込みと解析の準備
    localStorage.setItem('currentFiles', JSON.stringify(validFiles.map(f => f.name)));
}

// 診断開始
async function startDiagnostic() {
    const progressSection = document.getElementById('progressSection');
    const resultSection = document.getElementById('resultSection');
    
    progressSection.style.display = 'block';
    resultSection.style.display = 'none';

    // 進捗バーの更新
    const progressBar = document.querySelector('.progress-bar');
    const checkItems = document.querySelectorAll('.check-item i');
    
    try {
        // コーディング規約チェック
        await updateProgress(0, checkItems);
        const codingResults = await performCodingCheck();
        
        // セキュリティ診断
        await updateProgress(25, checkItems);
        const securityResults = await performSecurityCheck();
        
        // パフォーマンス分析
        await updateProgress(50, checkItems);
        const performanceResults = await performPerformanceAnalysis();
        
        // 依存関係チェック
        await updateProgress(75, checkItems);
        const dependencyResults = await checkDependencies();
        
        // 結果の表示
        await updateProgress(100, checkItems);
        showResults({
            coding: codingResults,
            security: securityResults,
            performance: performanceResults,
            dependencies: dependencyResults
        });
        
    } catch (error) {
        showError('診断中にエラーが発生しました: ' + error.message);
    }
}

// 進捗更新
async function updateProgress(percentage, checkItems) {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = `${percentage}%`;
    
    const currentStep = Math.floor(percentage / 25);
    checkItems.forEach((item, index) => {
        if (index < currentStep) {
            item.classList.remove('status-pending', 'status-running');
            item.classList.add('status-success');
        } else if (index === currentStep) {
            item.classList.remove('status-pending', 'status-success');
            item.classList.add('status-running');
        }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
}

// 各種チェック関数
async function performCodingCheck() {
    return {
        issues: [
            {
                severity: 'high',
                message: 'インデントの不一致が見つかりました',
                file: 'src/components/Main.js',
                line: 24
            },
            {
                severity: 'medium',
                message: '未使用の変数が存在します',
                file: 'src/utils/helpers.js',
                line: 15
            }
        ]
    };
}

async function performSecurityCheck() {
    return {
        issues: [
            {
                severity: 'high',
                message: '古いバージョンのライブラリが使用されています',
                file: 'package.json',
                details: 'react-scripts@4.0.0に既知の脆弱性があります'
            }
        ]
    };
}

async function performPerformanceAnalysis() {
    return {
        issues: [
            {
                severity: 'medium',
                message: '大きなバンドルサイズ',
                details: 'メインバンドルが2MB以上です'
            }
        ]
    };
}

async function checkDependencies() {
    return {
        issues: [
            {
                severity: 'low',
                message: '非推奨のパッケージが使用されています',
                package: 'moment',
                recommendation: 'date-fnsの使用を推奨'
            }
        ]
    };
}

// 結果表示
function showResults(results) {
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // カウンターの更新
    let criticalCount = 0;
    let warningCount = 0;
    let suggestionCount = 0;
    let passedCount = 0;

    // 結果の集計
    Object.values(results).forEach(result => {
        result.issues.forEach(issue => {
            switch (issue.severity) {
                case 'high':
                    criticalCount++;
                    break;
                case 'medium':
                    warningCount++;
                    break;
                case 'low':
                    suggestionCount++;
                    break;
            }
        });
    });

    // カウンターの表示更新
    document.getElementById('criticalIssues').textContent = criticalCount;
    document.getElementById('warnings').textContent = warningCount;
    document.getElementById('suggestions').textContent = suggestionCount;
    document.getElementById('passed').textContent = 
        Object.keys(results).length * 3 - (criticalCount + warningCount + suggestionCount);

    // 詳細結果の表示
    const detailedResults = document.getElementById('detailedResults');
    detailedResults.innerHTML = '';

    Object.entries(results).forEach(([category, result]) => {
        result.issues.forEach(issue => {
            const issueElement = createIssueElement(category, issue);
            detailedResults.appendChild(issueElement);
        });
    });
}

// 問題表示要素の作成
function createIssueElement(category, issue) {
    const div = document.createElement('div');
    div.className = `result-card severity-${issue.severity} mb-3`;
    
    const content = `
        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-${getSeverityIcon(issue.severity)} me-2"></i>
            <h5 class="mb-0">${issue.message}</h5>
        </div>
        <div class="text-muted">
            ${issue.file ? `<p class="mb-1">ファイル: ${issue.file}</p>` : ''}
            ${issue.line ? `<p class="mb-1">行: ${issue.line}</p>` : ''}
            ${issue.details ? `<p class="mb-1">詳細: ${issue.details}</p>` : ''}
            ${issue.recommendation ? `<p class="mb-1">推奨: ${issue.recommendation}</p>` : ''}
        </div>
    `;
    
    div.innerHTML = content;
    return div;
}

// アイコン取得
function getSeverityIcon(severity) {
    switch (severity) {
        case 'high':
            return 'exclamation-triangle';
        case 'medium':
            return 'exclamation-circle';
        case 'low':
            return 'info-circle';
        default:
            return 'check-circle';
    }
}

// エラー表示
function showError(message) {
    alert(message);
}

// レポート生成
async function generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `diagnostic-report-${timestamp}.html`;
    
    const reportContent = document.getElementById('resultSection').innerHTML;
    const fullReport = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>診断レポート - ${timestamp}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        </head>
        <body class="container py-5">
            <h1 class="mb-4">診断レポート</h1>
            <p class="text-muted">生成日時: ${new Date().toLocaleString()}</p>
            ${reportContent}
        </body>
        </html>
    `;
    
    const blob = new Blob([fullReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// リリースフロー開始
async function startRelease() {
    const criticalIssues = parseInt(document.getElementById('criticalIssues').textContent);
    if (criticalIssues > 0) {
        if (!confirm('重要な問題が未解決です。本当にリリースを開始しますか？')) {
            return;
        }
    }
    
    try {
        // リリースフローの実行（実際の実装ではCI/CDパイプラインと連携）
        alert('リリースフローを開始します。\n\n1. ビルド\n2. テスト実行\n3. デプロイ');
    } catch (error) {
        showError('リリースフロー実行中にエラーが発生しました: ' + error.message);
    }
}

// 前回の結果読み込み
function loadLastReport() {
    const lastReport = localStorage.getItem('lastReport');
    if (!lastReport) {
        showError('前回の診断結果が見つかりません。');
        return;
    }
    
    try {
        const results = JSON.parse(lastReport);
        showResults(results);
    } catch (error) {
        showError('前回の結果の読み込みに失敗しました: ' + error.message);
    }
} 