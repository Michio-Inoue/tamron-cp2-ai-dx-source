// リリースフローの状態管理
let flowState = {
    currentStep: 1,
    totalSteps: 5,
    isPaused: false,
    isStarted: false,
    startTime: null,
    selectedFiles: [],
    steps: [
        {
            id: 1,
            name: 'ソースコード診断',
            status: 'pending',
            logs: []
        },
        {
            id: 2,
            name: 'ビルド処理',
            status: 'pending',
            logs: []
        },
        {
            id: 3,
            name: 'テスト実行',
            status: 'pending',
            logs: []
        },
        {
            id: 4,
            name: 'ドキュメント生成',
            status: 'pending',
            logs: []
        },
        {
            id: 5,
            name: 'デプロイ',
            status: 'pending',
            logs: []
        }
    ]
};

// ユーティリティ関数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ファイル選択イベントの処理
document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const selectedFilesDiv = document.getElementById('selectedFiles');
    selectedFilesDiv.innerHTML = '';
    flowState.selectedFiles = [];

    for (let file of files) {
        flowState.selectedFiles.push(file);
        const fileItem = document.createElement('div');
        fileItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        fileItem.innerHTML = `
            <div>
                <i class="fas fa-file me-2"></i>
                ${file.name}
            </div>
            <span class="badge bg-primary rounded-pill">${(file.size / 1024).toFixed(1)} KB</span>
        `;
        selectedFilesDiv.appendChild(fileItem);
    }
});

// フロー開始関数
async function startFlow() {
    if (flowState.isStarted) return;
    if (flowState.selectedFiles.length === 0) {
        alert('診断するファイルを選択してください。');
        return;
    }
    
    // 状態をリセット
    flowState.steps.forEach(step => {
        step.status = 'pending';
        step.logs = [];
        const stepElement = document.querySelector(`.flow-step:nth-child(${step.id})`);
        const statusIcon = stepElement.querySelector('.step-status i');
        statusIcon.className = 'fas fa-clock status-pending';
        const logOutput = stepElement.querySelector('.log-output');
        if (logOutput) logOutput.textContent = '';
    });
    
    flowState.isStarted = true;
    flowState.startTime = new Date();
    flowState.currentStep = 1;
    flowState.isPaused = false;
    
    document.getElementById('startTime').textContent = flowState.startTime.toLocaleString('ja-JP');
    
    // ボタンの状態を更新
    document.getElementById('startButton').disabled = true;
    document.querySelector('button[onclick="pauseFlow()"]').disabled = false;
    document.querySelector('button[onclick="stopFlow()"]').disabled = false;
    document.getElementById('fileInput').disabled = true;
    
    // プログレスバーをリセット
    updateProgress(0);
    
    // 診断を開始
    await runDiagnostics();
}

// ファイル読み込み関数
async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('ファイルの読み込みに失敗しました'));
        reader.readAsText(file);
    });
}

// コーディング規約チェック
async function checkCodingStandards(fileContent) {
    const issues = [];
    
    // 行の長さチェック（100文字以上）
    const lines = fileContent.split('\n');
    lines.forEach((line, index) => {
        if (line.length > 100) {
            issues.push(`行${index + 1}: 行が長すぎます（${line.length}文字）`);
        }
    });

    // インデントチェック
    let expectedIndent = 0;
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.length === 0) return;

        const actualIndent = line.search(/\S/);
        if (actualIndent % 4 !== 0) {
            issues.push(`行${index + 1}: インデントが不正です（${actualIndent}スペース）`);
        }

        if (trimmedLine.includes('{')) expectedIndent += 4;
        if (trimmedLine.includes('}')) expectedIndent -= 4;
    });

    // コメント率チェック
    const commentLines = lines.filter(line => 
        line.trim().startsWith('//') || 
        line.trim().startsWith('/*') || 
        line.trim().startsWith('*')
    ).length;
    const codeLines = lines.filter(line => line.trim().length > 0).length;
    const commentRatio = (commentLines / codeLines) * 100;
    
    if (commentRatio < 10) {
        issues.push(`コメントが不足しています（コメント率: ${commentRatio.toFixed(1)}%）`);
    }

    return issues;
}

// セキュリティチェック
async function checkSecurity(fileContent) {
    const issues = [];
    
    // 危険な関数や設定のチェック
    const securityPatterns = {
        'eval': /eval\s*\(/g,
        'innerHTML': /\.innerHTML\s*=/g,
        'http://': /http:\/\//g,
        'console.log': /console\.log/g,
        'localStorage': /localStorage\./g,
        'sessionStorage': /sessionStorage\./g
    };

    Object.entries(securityPatterns).forEach(([key, pattern]) => {
        if (pattern.test(fileContent)) {
            issues.push(`危険な機能の使用: ${key}`);
        }
    });

    // パスワードや機密情報の直接記述チェック
    if (/password|secret|key|token/i.test(fileContent)) {
        issues.push('機密情報が直接コードに記述されている可能性があります');
    }

    return issues;
}

// パフォーマンスチェック
async function checkPerformance(fileContent) {
    const issues = [];
    
    // 非効率なループのチェック
    if (/for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/g.test(fileContent)) {
        issues.push('ネストされたループが検出されました - パフォーマンスに影響を与える可能性があります');
    }

    // 大きな配列や文字列の連結
    if (/\+=\s*['"][^'"]*['"]/g.test(fileContent)) {
        issues.push('文字列の連結に += 演算子が使用されています - 代わりに配列の join() メソッドの使用を検討してください');
    }

    // DOM操作の最適化
    const domOperations = (fileContent.match(/document\.getElement|querySelector/g) || []).length;
    if (domOperations > 10) {
        issues.push(`DOM操作が多すぎます（${domOperations}回） - キャッシュの使用を検討してください`);
    }

    return issues;
}

// 診断処理の実行
async function runDiagnostics() {
    if (flowState.isPaused) return;

    try {
        addLog(1, '[INFO] ソースコード診断を開始します...');
        
        for (const file of flowState.selectedFiles) {
            addLog(1, `[INFO] ${file.name}の診断を開始します...`);
            const fileContent = await readFileContent(file);
            
            // コーディング規約チェック
            addLog(1, '[INFO] コーディング規約チェックを実行中...');
            const codingIssues = await checkCodingStandards(fileContent);
            
            if (codingIssues.length > 0) {
                addLog(1, `[WARNING] ${file.name}でコーディング規約違反が${codingIssues.length}件見つかりました`);
                codingIssues.forEach(issue => {
                    addLog(1, `  - ${issue}`);
                });
            } else {
                addLog(1, `[SUCCESS] ${file.name}のコーディング規約チェックに問題はありません`);
            }

            // セキュリティチェック
            addLog(1, '[INFO] セキュリティスキャンを実行中...');
            const securityIssues = await checkSecurity(fileContent);
            
            if (securityIssues.length > 0) {
                addLog(1, `[WARNING] ${file.name}でセキュリティ上の問題が見つかりました`);
                securityIssues.forEach(issue => {
                    addLog(1, `  - ${issue}`);
                });
            } else {
                addLog(1, `[SUCCESS] ${file.name}のセキュリティチェックに問題はありません`);
            }

            // パフォーマンスチェック
            addLog(1, '[INFO] パフォーマンス分析を実行中...');
            const perfIssues = await checkPerformance(fileContent);
            
            if (perfIssues.length > 0) {
                addLog(1, `[WARNING] ${file.name}でパフォーマンス上の問題が見つかりました`);
                perfIssues.forEach(issue => {
                    addLog(1, `  - ${issue}`);
                });
            } else {
                addLog(1, `[SUCCESS] ${file.name}のパフォーマンスチェックに問題はありません`);
            }

            await sleep(1000); // ファイル間の処理に少し間を空ける
        }

        // 全体の診断結果の判定
        const hasErrors = document.querySelector('.log-output').textContent.includes('[ERROR]');
        const warningCount = (document.querySelector('.log-output').textContent.match(/\[WARNING\]/g) || []).length;
        
        if (hasErrors) {
            addLog(1, '[ERROR] 重大な問題が見つかりました。リリースフローを中止します');
            updateStep(1, 'error');
            stopFlow();
            return;
        } else if (warningCount > 5) {
            addLog(1, '[ERROR] 警告が多すぎます。リリースフローを中止します');
            updateStep(1, 'error');
            stopFlow();
            return;
        } else if (warningCount > 0) {
            addLog(1, '[WARNING] 軽微な問題が見つかりましたが、ビルドを続行します');
            updateStep(1, 'success');
            continueToNextStep();
        } else {
            addLog(1, '[SUCCESS] すべての診断が完了しました。問題は見つかりませんでした。');
            updateStep(1, 'success');
            continueToNextStep();
        }

    } catch (error) {
        addLog(1, '[ERROR] 診断処理中にエラーが発生しました');
        addLog(1, `[ERROR] ${error.message}`);
        updateStep(1, 'error');
        stopFlow();
    }
}

// フロー制御関数
function pauseFlow() {
    flowState.isPaused = true;
    const button = document.querySelector('button[onclick="pauseFlow()"]');
    button.innerHTML = '<i class="fas fa-play me-2"></i>再開';
    button.onclick = resumeFlow;
    
    // 実行中のステップのアニメーションを停止
    const runningIcon = document.querySelector('.fa-spinner');
    if (runningIcon) {
        runningIcon.style.animationPlayState = 'paused';
    }
    
    addLog(flowState.currentStep, '[INFO] フローを一時停止しました');
}

function resumeFlow() {
    flowState.isPaused = false;
    const button = document.querySelector('button[onclick="resumeFlow()"]');
    button.innerHTML = '<i class="fas fa-pause me-2"></i>一時停止';
    button.onclick = pauseFlow;
    
    // アニメーションを再開
    const runningIcon = document.querySelector('.fa-spinner');
    if (runningIcon) {
        runningIcon.style.animationPlayState = 'running';
    }
    
    addLog(flowState.currentStep, '[INFO] フローを再開しました');
    continueFlow();
}

function stopFlow() {
    if (!flowState.isStarted) return;
    
    flowState.isStarted = false;
    flowState.isPaused = false;
    
    // ボタンの状態を更新
    document.getElementById('startButton').disabled = false;
    document.getElementById('fileInput').disabled = false;
    const pauseButton = document.querySelector('button[onclick="pauseFlow()"]');
    pauseButton.innerHTML = '<i class="fas fa-pause me-2"></i>一時停止';
    pauseButton.onclick = pauseFlow;
    pauseButton.disabled = true;
    document.querySelector('button[onclick="stopFlow()"]').disabled = true;
    
    // 実行中のステップを失敗状態に
    if (flowState.currentStep <= flowState.totalSteps) {
        updateStep(flowState.currentStep, 'error');
        addLog(flowState.currentStep, '[ERROR] フローが中止されました');
    }
}

// ステップ管理関数
function updateStep(stepNumber, status) {
    const stepElement = document.querySelector(`.flow-step:nth-child(${stepNumber})`);
    const statusIcon = stepElement.querySelector('.step-status i');
    
    // アイコンの更新
    statusIcon.className = `fas fa-${
        status === 'running' ? 'spinner' :
        status === 'success' ? 'check' :
        status === 'error' ? 'times' :
        'clock'
    } status-${status}`;
}

function updateProgress(percent) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
}

function addLog(stepNumber, message) {
    const stepElement = document.querySelector(`.flow-step:nth-child(${stepNumber})`);
    const logOutput = stepElement.querySelector('.log-output');
    const timestamp = new Date().toLocaleTimeString('ja-JP');
    logOutput.textContent += `[${timestamp}] ${message}\n`;
    logOutput.scrollTop = logOutput.scrollHeight;
}

// フロー継続関数
async function continueToNextStep() {
    if (flowState.isPaused) return;
    
    flowState.currentStep++;
    if (flowState.currentStep > flowState.totalSteps) {
        addLog(flowState.totalSteps, '[SUCCESS] すべての処理が完了しました');
        stopFlow();
        return;
    }
    
    updateProgress((flowState.currentStep - 1) * 100 / flowState.totalSteps);
    
    // 次のステップを開始
    switch (flowState.currentStep) {
        case 2:
            await simulateBuild();
            break;
        case 3:
            await simulateTests();
            break;
        case 4:
            await simulateDocGeneration();
            break;
        case 5:
            await simulateDeploy();
            break;
    }
}

// シミュレーション関数を実際の処理に変更
async function simulateBuild() {
    updateStep(2, 'running');
    addLog(2, '[INFO] ビルド処理を開始します...');
    
    try {
        // 選択されたファイルの分析
        let totalSize = 0;
        let jsFiles = 0;
        let cssFiles = 0;
        let htmlFiles = 0;
        let buildIssues = [];

        for (const file of flowState.selectedFiles) {
            const content = await readFileContent(file);
            const ext = file.name.split('.').pop().toLowerCase();
            
            switch (ext) {
                case 'js':
                    jsFiles++;
                    // JavaScriptの構文チェック
                    try {
                        new Function(content);
                    } catch (e) {
                        buildIssues.push(`${file.name}: 構文エラー - ${e.message}`);
                    }
                    break;
                case 'css':
                    cssFiles++;
                    // CSSの基本的なバリデーション
                    if (content.includes('{') !== content.includes('}')) {
                        buildIssues.push(`${file.name}: 中括弧の数が一致しません`);
                    }
                    break;
                case 'html':
                    htmlFiles++;
                    // HTMLの基本的なバリデーション
                    if (!content.includes('<!DOCTYPE html>')) {
                        buildIssues.push(`${file.name}: DOCTYPE宣言がありません`);
                    }
                    break;
            }
            
            totalSize += file.size;
            await sleep(500); // ファイル処理の進捗表示用
        }

        addLog(2, `[INFO] ファイル構成:`);
        addLog(2, `  - JavaScript: ${jsFiles}ファイル`);
        addLog(2, `  - CSS: ${cssFiles}ファイル`);
        addLog(2, `  - HTML: ${htmlFiles}ファイル`);
        addLog(2, `  - 合計サイズ: ${(totalSize / 1024).toFixed(1)}KB`);

        if (buildIssues.length > 0) {
            addLog(2, '[WARNING] ビルド時の問題:');
            buildIssues.forEach(issue => addLog(2, `  - ${issue}`));
            if (buildIssues.length > 3) {
                throw new Error('重大なビルドエラーが検出されました');
            }
        }
        
        addLog(2, '[SUCCESS] ビルドが正常に完了しました');
        updateStep(2, 'success');
        continueToNextStep();
    } catch (error) {
        addLog(2, `[ERROR] ${error.message}`);
        updateStep(2, 'error');
        stopFlow();
    }
}

async function simulateTests() {
    updateStep(3, 'running');
    addLog(3, '[INFO] テストを開始します...');
    
    try {
        const testResults = [];
        
        for (const file of flowState.selectedFiles) {
            const content = await readFileContent(file);
            const ext = file.name.split('.').pop().toLowerCase();
            
            addLog(3, `[INFO] ${file.name}のテストを実行中...`);
            
            // ファイルタイプ別のテスト
            switch (ext) {
                case 'js':
                    // JavaScriptファイルのテスト
                    if (content.includes('function')) {
                        const functionCount = (content.match(/function\s+\w+/g) || []).length;
                        const testCount = (content.match(/test\(|it\(|describe\(/g) || []).length;
                        if (testCount === 0) {
                            testResults.push(`${file.name}: テストケースが見つかりません`);
                        }
                        addLog(3, `  - 関数数: ${functionCount}`);
                        addLog(3, `  - テストケース数: ${testCount}`);
                    }
                    break;
                    
                case 'html':
                    // HTMLファイルのテスト
                    const imgTags = (content.match(/<img[^>]+>/g) || []);
                    const imgWithoutAlt = imgTags.filter(tag => !tag.includes('alt='));
                    if (imgWithoutAlt.length > 0) {
                        testResults.push(`${file.name}: ${imgWithoutAlt.length}個の画像にalt属性がありません`);
                    }
                    
                    // リンクのチェック
                    const brokenLinks = [];
                    const links = content.match(/href=["'][^"']+["']/g) || [];
                    links.forEach(link => {
                        const url = link.match(/href=["']([^"']+)["']/)[1];
                        if (url.startsWith('http://')) {
                            testResults.push(`${file.name}: 安全でないリンクが使用されています: ${url}`);
                        }
                    });
                    break;
                    
                case 'css':
                    // CSSファイルのテスト
                    const importantCount = (content.match(/!important/g) || []).length;
                    if (importantCount > 0) {
                        testResults.push(`${file.name}: !importantの使用が${importantCount}箇所あります`);
                    }
                    break;
            }
            
            await sleep(1000);
        }
        
        if (testResults.length > 0) {
            addLog(3, '[WARNING] テスト結果:');
            testResults.forEach(result => addLog(3, `  - ${result}`));
            if (testResults.length > 5) {
                throw new Error('テストの失敗が多すぎます');
            }
        } else {
            addLog(3, '[SUCCESS] すべてのテストが成功しました');
        }
        
        updateStep(3, 'success');
        continueToNextStep();
    } catch (error) {
        addLog(3, `[ERROR] ${error.message}`);
        updateStep(3, 'error');
        stopFlow();
    }
}

async function simulateDocGeneration() {
    updateStep(4, 'running');
    addLog(4, '[INFO] ドキュメント生成を開始します...');
    
    try {
        const docStats = {
            functions: 0,
            classes: 0,
            comments: 0,
            todos: 0
        };
        
        for (const file of flowState.selectedFiles) {
            const content = await readFileContent(file);
            const ext = file.name.split('.').pop().toLowerCase();
            
            if (ext === 'js') {
                // 関数とクラスの抽出
                const functions = content.match(/function\s+\w+/g) || [];
                const classes = content.match(/class\s+\w+/g) || [];
                const comments = content.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) || [];
                const todos = content.match(/\/\/\s*TODO:/g) || [];
                
                docStats.functions += functions.length;
                docStats.classes += classes.length;
                docStats.comments += comments.length;
                docStats.todos += todos.length;
                
                addLog(4, `[INFO] ${file.name}の解析結果:`);
                addLog(4, `  - 関数数: ${functions.length}`);
                addLog(4, `  - クラス数: ${classes.length}`);
                addLog(4, `  - コメント数: ${comments.length}`);
                if (todos.length > 0) {
                    addLog(4, `  - TODO: ${todos.length}件`);
                }
            }
            
            await sleep(500);
        }
        
        addLog(4, '[INFO] ドキュメント生成の統計:');
        addLog(4, `  - 合計関数数: ${docStats.functions}`);
        addLog(4, `  - 合計クラス数: ${docStats.classes}`);
        addLog(4, `  - 合計コメント数: ${docStats.comments}`);
        
        if (docStats.todos > 0) {
            addLog(4, `[WARNING] 未解決のTODOが${docStats.todos}件あります`);
        }
        
        if (docStats.comments < docStats.functions) {
            addLog(4, '[WARNING] 関数に対するドキュメントが不足しています');
        }
        
        addLog(4, '[SUCCESS] ドキュメントが正常に生成されました');
        updateStep(4, 'success');
        continueToNextStep();
    } catch (error) {
        addLog(4, `[ERROR] ${error.message}`);
        updateStep(4, 'error');
        stopFlow();
    }
}

async function simulateDeploy() {
    updateStep(5, 'running');
    addLog(5, '[INFO] デプロイを開始します...');
    
    try {
        let totalSize = 0;
        const deployFiles = [];
        
        for (const file of flowState.selectedFiles) {
            const content = await readFileContent(file);
            totalSize += file.size;
            deployFiles.push({
                name: file.name,
                size: file.size,
                type: file.name.split('.').pop().toLowerCase()
            });
            await sleep(500);
        }
        
        addLog(5, '[INFO] デプロイ対象ファイル:');
        deployFiles.forEach(file => {
            addLog(5, `  - ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
        });
        
        const totalSizeMB = totalSize / (1024 * 1024);
        addLog(5, `[INFO] 合計サイズ: ${totalSizeMB.toFixed(2)}MB`);
        
        if (totalSizeMB > 10) {
            throw new Error('デプロイサイズが制限（10MB）を超えています');
        }
        
        // ファイルタイプ別の検証
        const fileTypes = deployFiles.reduce((acc, file) => {
            acc[file.type] = (acc[file.type] || 0) + 1;
            return acc;
        }, {});
        
        addLog(5, '[INFO] ファイルタイプ別集計:');
        Object.entries(fileTypes).forEach(([type, count]) => {
            addLog(5, `  - ${type}: ${count}ファイル`);
        });
        
        if (!fileTypes['html']) {
            addLog(5, '[WARNING] HTMLファイルが含まれていません');
        }
        
        addLog(5, '[SUCCESS] デプロイが正常に完了しました');
        updateStep(5, 'success');
        continueToNextStep();
    } catch (error) {
        addLog(5, `[ERROR] ${error.message}`);
        updateStep(5, 'error');
        stopFlow();
    }
}

// DOMContentLoadedイベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    // ボタンの初期状態を設定
    document.querySelector('button[onclick="pauseFlow()"]').disabled = true;
    document.querySelector('button[onclick="stopFlow()"]').disabled = true;
}); 