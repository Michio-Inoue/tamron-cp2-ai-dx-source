-- AIAG-VDA FMEAデータベース設計（PostgreSQL用SQL DDL）

-- 1. FMEAプロジェクト管理テーブル
CREATE TABLE FMEA_Project (
    FMEA_ID UUID PRIMARY KEY,
    model_name TEXT NOT NULL,         -- 機種名
    customer_name TEXT,               -- 顧客名
    part_name TEXT,                   -- 部品名
    system_component TEXT,            -- システム/サブシステム/コンポーネント
    preparer TEXT,                    -- 準備者
    created_at DATE,                  -- 日付
    fmea_type TEXT,                   -- FMEAタイプ
    purpose TEXT,                     -- 目的
    version_date DATE NOT NULL,       -- バージョン管理用
    UNIQUE(model_name, version_date)
);

-- 2. 機能分析テーブル
CREATE TABLE FunctionAnalysis (
    FunctionAnalysis_ID UUID PRIMARY KEY,
    FMEA_ID UUID NOT NULL REFERENCES FMEA_Project(FMEA_ID) ON DELETE CASCADE,
    function TEXT NOT NULL,           -- 機能
    requirement TEXT                   -- 要求事項
);

-- 3. 故障分析テーブル
CREATE TABLE FailureAnalysis (
    FailureAnalysis_ID UUID PRIMARY KEY,
    FunctionAnalysis_ID UUID NOT NULL REFERENCES FunctionAnalysis(FunctionAnalysis_ID) ON DELETE CASCADE,
    failure_mode TEXT NOT NULL,       -- 故障モード
    customer_effect TEXT,             -- 顧客への影響
    system_effect TEXT,               -- システムへの影響
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 10), -- 重大度
    evidence TEXT                     -- 影響の証拠
);

-- 4. 原因分析テーブル
CREATE TABLE CauseAnalysis (
    CauseAnalysis_ID UUID PRIMARY KEY,
    FailureAnalysis_ID UUID NOT NULL REFERENCES FailureAnalysis(FailureAnalysis_ID) ON DELETE CASCADE,
    cause TEXT NOT NULL               -- 故障原因
);

-- 5. 現在の管理テーブル
CREATE TABLE CurrentControl (
    CurrentControl_ID UUID PRIMARY KEY,
    CauseAnalysis_ID UUID NOT NULL REFERENCES CauseAnalysis(CauseAnalysis_ID) ON DELETE CASCADE,
    preventive_control TEXT,          -- 予防管理
    detection_control TEXT            -- 検出管理
);

-- 6. 評価テーブル
CREATE TABLE Evaluation (
    Evaluation_ID UUID PRIMARY KEY,
    CauseAnalysis_ID UUID NOT NULL REFERENCES CauseAnalysis(CauseAnalysis_ID) ON DELETE CASCADE,
    occurrence INTEGER NOT NULL CHECK (occurrence BETWEEN 1 AND 10), -- 発生度
    detection INTEGER NOT NULL CHECK (detection BETWEEN 1 AND 10),   -- 検出度
    action_priority TEXT NOT NULL CHECK (action_priority IN ('H', 'M', 'L')) -- アクション優先度
);

-- 7. 推奨アクションテーブル
CREATE TABLE RecommendedAction (
    RecommendedAction_ID UUID PRIMARY KEY,
    Evaluation_ID UUID NOT NULL REFERENCES Evaluation(Evaluation_ID) ON DELETE CASCADE,
    recommended_action TEXT,          -- 推奨アクション
    responsible TEXT,                 -- 担当者
    due_date DATE,                    -- 期日
    status TEXT,                      -- 実施状況
    completed_date DATE               -- 完了日
);

-- 8. 実施後評価テーブル
CREATE TABLE PostImplementationEvaluation (
    PostImplementationEvaluation_ID UUID PRIMARY KEY,
    RecommendedAction_ID UUID NOT NULL REFERENCES RecommendedAction(RecommendedAction_ID) ON DELETE CASCADE,
    occurrence_post INTEGER CHECK (occurrence_post BETWEEN 1 AND 10), -- 実施後の発生度
    detection_post INTEGER CHECK (detection_post BETWEEN 1 AND 10),   -- 実施後の検出度
    severity_post INTEGER CHECK (severity_post BETWEEN 1 AND 10),     -- 実施後の重大度
    action_priority_post TEXT CHECK (action_priority_post IN ('H', 'M', 'L')) -- 実施後AP
);

-- 9. ドキュメント管理テーブル
CREATE TABLE Document (
    Document_ID UUID PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- 10. 故障モード-ドキュメント紐づけテーブル
CREATE TABLE FailureModeDocument (
    FailureModeDocument_ID UUID PRIMARY KEY,
    FailureAnalysis_ID UUID NOT NULL REFERENCES FailureAnalysis(FailureAnalysis_ID) ON DELETE CASCADE,
    Document_ID UUID NOT NULL REFERENCES Document(Document_ID) ON DELETE CASCADE
);

-- 11. 仕様-故障モード-故障原因の多段階紐づけ
CREATE TABLE Spec_Failure_Cause_Link (
    Link_ID UUID PRIMARY KEY,
    FunctionAnalysis_ID UUID NOT NULL REFERENCES FunctionAnalysis(FunctionAnalysis_ID) ON DELETE CASCADE,
    FailureAnalysis_ID UUID NOT NULL REFERENCES FailureAnalysis(FailureAnalysis_ID) ON DELETE CASCADE,
    CauseAnalysis_ID UUID NOT NULL REFERENCES CauseAnalysis(CauseAnalysis_ID) ON DELETE CASCADE
);

-- 12. 故障モードのAI傾向調査用テーブル
CREATE TABLE FailureModeAITrend (
    Trend_ID UUID PRIMARY KEY,
    FailureAnalysis_ID UUID NOT NULL REFERENCES FailureAnalysis(FailureAnalysis_ID) ON DELETE CASCADE,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ai_summary TEXT,                  -- AIによる傾向分析サマリ
    ai_json JSONB                     -- AIによる詳細分析（構造化データ）
);

-- 13. 過去機種報告書参照用の故障モード-ドキュメント履歴リンク
CREATE TABLE FailureModeHistoryReport (
    HistoryReport_ID UUID PRIMARY KEY,
    FailureAnalysis_ID UUID NOT NULL REFERENCES FailureAnalysis(FailureAnalysis_ID) ON DELETE CASCADE,
    Document_ID UUID NOT NULL REFERENCES Document(Document_ID) ON DELETE CASCADE,
    model_name TEXT NOT NULL,         -- 参照元機種名
    version_date DATE NOT NULL        -- 参照元バージョン日付
);

-- インデックス例
CREATE INDEX idx_fmea_project_model_name ON FMEA_Project(model_name);
CREATE INDEX idx_failureanalysis_failure_mode ON FailureAnalysis(failure_mode);
CREATE INDEX idx_document_file_name ON Document(file_name); 