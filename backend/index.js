const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = 4000;

// CORS許可
app.use(cors());
// JSONパース
app.use(express.json());
// ファイルアップロード用ディレクトリ
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// PostgreSQL接続設定
const pool = new Pool({
  user: 'postgres', // ←適宜変更
  host: 'localhost',
  database: 'fmea_db', // ←適宜変更
  password: 'yourpassword', // ←適宜変更
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('FMEA API Server is running');
});

// FMEA_Project 一覧取得
app.get('/api/fmea_project', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM FMEA_Project ORDER BY version_date DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// FMEA_Project 新規登録
app.post('/api/fmea_project', async (req, res) => {
  const {
    model_name, customer_name, part_name, system_component,
    preparer, created_at, fmea_type, purpose, version_date
  } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO FMEA_Project (
        FMEA_ID, model_name, customer_name, part_name, system_component,
        preparer, created_at, fmea_type, purpose, version_date
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, model_name, customer_name, part_name, system_component,
        preparer, created_at, fmea_type, purpose, version_date]
    );
    res.json({ FMEA_ID: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// FMEA_Project 更新
app.put('/api/fmea_project/:id', async (req, res) => {
  const id = req.params.id;
  const {
    model_name, customer_name, part_name, system_component,
    preparer, created_at, fmea_type, purpose, version_date
  } = req.body;
  try {
    await pool.query(
      `UPDATE FMEA_Project SET
        model_name=$2, customer_name=$3, part_name=$4, system_component=$5,
        preparer=$6, created_at=$7, fmea_type=$8, purpose=$9, version_date=$10
      WHERE FMEA_ID=$1`,
      [id, model_name, customer_name, part_name, system_component,
        preparer, created_at, fmea_type, purpose, version_date]
    );
    res.json({ FMEA_ID: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// FMEA_Project 削除
app.delete('/api/fmea_project/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM FMEA_Project WHERE FMEA_ID=$1', [id]);
    res.json({ FMEA_ID: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// FunctionAnalysis CRUD
app.get('/api/function_analysis', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM FunctionAnalysis ORDER BY FunctionAnalysis_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/function_analysis', async (req, res) => {
  const { FMEA_ID, function: func, requirement } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO FunctionAnalysis (FunctionAnalysis_ID, FMEA_ID, function, requirement) VALUES ($1, $2, $3, $4)`,
      [id, FMEA_ID, func, requirement]
    );
    res.json({ FunctionAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/function_analysis/:id', async (req, res) => {
  const id = req.params.id;
  const { FMEA_ID, function: func, requirement } = req.body;
  try {
    await pool.query(
      `UPDATE FunctionAnalysis SET FMEA_ID=$2, function=$3, requirement=$4 WHERE FunctionAnalysis_ID=$1`,
      [id, FMEA_ID, func, requirement]
    );
    res.json({ FunctionAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/function_analysis/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM FunctionAnalysis WHERE FunctionAnalysis_ID=$1', [id]);
    res.json({ FunctionAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FailureAnalysis CRUD
app.get('/api/failure_analysis', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM FailureAnalysis ORDER BY FailureAnalysis_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/failure_analysis', async (req, res) => {
  const { FunctionAnalysis_ID, failure_mode, customer_effect, system_effect, severity, evidence } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO FailureAnalysis (FailureAnalysis_ID, FunctionAnalysis_ID, failure_mode, customer_effect, system_effect, severity, evidence) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, FunctionAnalysis_ID, failure_mode, customer_effect, system_effect, severity, evidence]
    );
    res.json({ FailureAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/failure_analysis/:id', async (req, res) => {
  const id = req.params.id;
  const { FunctionAnalysis_ID, failure_mode, customer_effect, system_effect, severity, evidence } = req.body;
  try {
    await pool.query(
      `UPDATE FailureAnalysis SET FunctionAnalysis_ID=$2, failure_mode=$3, customer_effect=$4, system_effect=$5, severity=$6, evidence=$7 WHERE FailureAnalysis_ID=$1`,
      [id, FunctionAnalysis_ID, failure_mode, customer_effect, system_effect, severity, evidence]
    );
    res.json({ FailureAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/failure_analysis/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM FailureAnalysis WHERE FailureAnalysis_ID=$1', [id]);
    res.json({ FailureAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CauseAnalysis CRUD
app.get('/api/cause_analysis', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM CauseAnalysis ORDER BY CauseAnalysis_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/cause_analysis', async (req, res) => {
  const { FailureAnalysis_ID, cause } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO CauseAnalysis (CauseAnalysis_ID, FailureAnalysis_ID, cause) VALUES ($1, $2, $3)`,
      [id, FailureAnalysis_ID, cause]
    );
    res.json({ CauseAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/cause_analysis/:id', async (req, res) => {
  const id = req.params.id;
  const { FailureAnalysis_ID, cause } = req.body;
  try {
    await pool.query(
      `UPDATE CauseAnalysis SET FailureAnalysis_ID=$2, cause=$3 WHERE CauseAnalysis_ID=$1`,
      [id, FailureAnalysis_ID, cause]
    );
    res.json({ CauseAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/cause_analysis/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM CauseAnalysis WHERE CauseAnalysis_ID=$1', [id]);
    res.json({ CauseAnalysis_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CurrentControl CRUD
app.get('/api/current_control', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM CurrentControl ORDER BY CurrentControl_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/current_control', async (req, res) => {
  const { CauseAnalysis_ID, preventive_control, detection_control } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO CurrentControl (CurrentControl_ID, CauseAnalysis_ID, preventive_control, detection_control) VALUES ($1, $2, $3, $4)`,
      [id, CauseAnalysis_ID, preventive_control, detection_control]
    );
    res.json({ CurrentControl_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/current_control/:id', async (req, res) => {
  const id = req.params.id;
  const { CauseAnalysis_ID, preventive_control, detection_control } = req.body;
  try {
    await pool.query(
      `UPDATE CurrentControl SET CauseAnalysis_ID=$2, preventive_control=$3, detection_control=$4 WHERE CurrentControl_ID=$1`,
      [id, CauseAnalysis_ID, preventive_control, detection_control]
    );
    res.json({ CurrentControl_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/current_control/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM CurrentControl WHERE CurrentControl_ID=$1', [id]);
    res.json({ CurrentControl_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Evaluation CRUD
app.get('/api/evaluation', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Evaluation ORDER BY Evaluation_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/evaluation', async (req, res) => {
  const { CauseAnalysis_ID, occurrence, detection, action_priority } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO Evaluation (Evaluation_ID, CauseAnalysis_ID, occurrence, detection, action_priority) VALUES ($1, $2, $3, $4, $5)`,
      [id, CauseAnalysis_ID, occurrence, detection, action_priority]
    );
    res.json({ Evaluation_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/evaluation/:id', async (req, res) => {
  const id = req.params.id;
  const { CauseAnalysis_ID, occurrence, detection, action_priority } = req.body;
  try {
    await pool.query(
      `UPDATE Evaluation SET CauseAnalysis_ID=$2, occurrence=$3, detection=$4, action_priority=$5 WHERE Evaluation_ID=$1`,
      [id, CauseAnalysis_ID, occurrence, detection, action_priority]
    );
    res.json({ Evaluation_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/evaluation/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM Evaluation WHERE Evaluation_ID=$1', [id]);
    res.json({ Evaluation_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// RecommendedAction CRUD
app.get('/api/recommended_action', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM RecommendedAction ORDER BY RecommendedAction_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/recommended_action', async (req, res) => {
  const { Evaluation_ID, recommended_action, responsible, due_date, status, completed_date } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO RecommendedAction (RecommendedAction_ID, Evaluation_ID, recommended_action, responsible, due_date, status, completed_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, Evaluation_ID, recommended_action, responsible, due_date, status, completed_date]
    );
    res.json({ RecommendedAction_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/recommended_action/:id', async (req, res) => {
  const id = req.params.id;
  const { Evaluation_ID, recommended_action, responsible, due_date, status, completed_date } = req.body;
  try {
    await pool.query(
      `UPDATE RecommendedAction SET Evaluation_ID=$2, recommended_action=$3, responsible=$4, due_date=$5, status=$6, completed_date=$7 WHERE RecommendedAction_ID=$1`,
      [id, Evaluation_ID, recommended_action, responsible, due_date, status, completed_date]
    );
    res.json({ RecommendedAction_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/recommended_action/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM RecommendedAction WHERE RecommendedAction_ID=$1', [id]);
    res.json({ RecommendedAction_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PostImplementationEvaluation CRUD
app.get('/api/post_implementation_evaluation', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PostImplementationEvaluation ORDER BY PostImplementationEvaluation_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/post_implementation_evaluation', async (req, res) => {
  const { RecommendedAction_ID, occurrence_post, detection_post, severity_post, action_priority_post } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO PostImplementationEvaluation (PostImplementationEvaluation_ID, RecommendedAction_ID, occurrence_post, detection_post, severity_post, action_priority_post) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, RecommendedAction_ID, occurrence_post, detection_post, severity_post, action_priority_post]
    );
    res.json({ PostImplementationEvaluation_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/post_implementation_evaluation/:id', async (req, res) => {
  const id = req.params.id;
  const { RecommendedAction_ID, occurrence_post, detection_post, severity_post, action_priority_post } = req.body;
  try {
    await pool.query(
      `UPDATE PostImplementationEvaluation SET RecommendedAction_ID=$2, occurrence_post=$3, detection_post=$4, severity_post=$5, action_priority_post=$6 WHERE PostImplementationEvaluation_ID=$1`,
      [id, RecommendedAction_ID, occurrence_post, detection_post, severity_post, action_priority_post]
    );
    res.json({ PostImplementationEvaluation_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/post_implementation_evaluation/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM PostImplementationEvaluation WHERE PostImplementationEvaluation_ID=$1', [id]);
    res.json({ PostImplementationEvaluation_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Document CRUD & ファイルアップロード
app.get('/api/document', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Document ORDER BY Document_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/document', async (req, res) => {
  const { file_name, file_path, description } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO Document (Document_ID, file_name, file_path, description) VALUES ($1, $2, $3, $4)`,
      [id, file_name, file_path, description]
    );
    res.json({ Document_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
// ファイルアップロード
app.post('/api/document/upload', upload.single('file'), async (req, res) => {
  const { originalname, path: filePath } = req.file;
  const { description } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO Document (Document_ID, file_name, file_path, description) VALUES ($1, $2, $3, $4)`,
      [id, originalname, filePath, description]
    );
    res.json({ Document_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/document/:id', async (req, res) => {
  const id = req.params.id;
  const { file_name, file_path, description } = req.body;
  try {
    await pool.query(
      `UPDATE Document SET file_name=$2, file_path=$3, description=$4 WHERE Document_ID=$1`,
      [id, file_name, file_path, description]
    );
    res.json({ Document_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/document/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM Document WHERE Document_ID=$1', [id]);
    res.json({ Document_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FailureModeDocument CRUD
app.get('/api/failure_mode_document', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM FailureModeDocument ORDER BY FailureModeDocument_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/failure_mode_document', async (req, res) => {
  const { FailureAnalysis_ID, Document_ID } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO FailureModeDocument (FailureModeDocument_ID, FailureAnalysis_ID, Document_ID) VALUES ($1, $2, $3)`,
      [id, FailureAnalysis_ID, Document_ID]
    );
    res.json({ FailureModeDocument_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/failure_mode_document/:id', async (req, res) => {
  const id = req.params.id;
  const { FailureAnalysis_ID, Document_ID } = req.body;
  try {
    await pool.query(
      `UPDATE FailureModeDocument SET FailureAnalysis_ID=$2, Document_ID=$3 WHERE FailureModeDocument_ID=$1`,
      [id, FailureAnalysis_ID, Document_ID]
    );
    res.json({ FailureModeDocument_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/failure_mode_document/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM FailureModeDocument WHERE FailureModeDocument_ID=$1', [id]);
    res.json({ FailureModeDocument_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Spec_Failure_Cause_Link CRUD
app.get('/api/spec_failure_cause_link', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Spec_Failure_Cause_Link ORDER BY Link_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/spec_failure_cause_link', async (req, res) => {
  const { FunctionAnalysis_ID, FailureAnalysis_ID, CauseAnalysis_ID } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO Spec_Failure_Cause_Link (Link_ID, FunctionAnalysis_ID, FailureAnalysis_ID, CauseAnalysis_ID) VALUES ($1, $2, $3, $4)`,
      [id, FunctionAnalysis_ID, FailureAnalysis_ID, CauseAnalysis_ID]
    );
    res.json({ Link_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/spec_failure_cause_link/:id', async (req, res) => {
  const id = req.params.id;
  const { FunctionAnalysis_ID, FailureAnalysis_ID, CauseAnalysis_ID } = req.body;
  try {
    await pool.query(
      `UPDATE Spec_Failure_Cause_Link SET FunctionAnalysis_ID=$2, FailureAnalysis_ID=$3, CauseAnalysis_ID=$4 WHERE Link_ID=$1`,
      [id, FunctionAnalysis_ID, FailureAnalysis_ID, CauseAnalysis_ID]
    );
    res.json({ Link_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/spec_failure_cause_link/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM Spec_Failure_Cause_Link WHERE Link_ID=$1', [id]);
    res.json({ Link_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FailureModeAITrend CRUD
app.get('/api/failure_mode_ai_trend', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM FailureModeAITrend ORDER BY Trend_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/failure_mode_ai_trend', async (req, res) => {
  const { FailureAnalysis_ID, ai_summary, ai_json } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO FailureModeAITrend (Trend_ID, FailureAnalysis_ID, ai_summary, ai_json) VALUES ($1, $2, $3, $4)`,
      [id, FailureAnalysis_ID, ai_summary, ai_json]
    );
    res.json({ Trend_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/failure_mode_ai_trend/:id', async (req, res) => {
  const id = req.params.id;
  const { FailureAnalysis_ID, ai_summary, ai_json } = req.body;
  try {
    await pool.query(
      `UPDATE FailureModeAITrend SET FailureAnalysis_ID=$2, ai_summary=$3, ai_json=$4 WHERE Trend_ID=$1`,
      [id, FailureAnalysis_ID, ai_summary, ai_json]
    );
    res.json({ Trend_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/failure_mode_ai_trend/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM FailureModeAITrend WHERE Trend_ID=$1', [id]);
    res.json({ Trend_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// FailureModeHistoryReport CRUD
app.get('/api/failure_mode_history_report', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM FailureModeHistoryReport ORDER BY HistoryReport_ID');
    res.json(result.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/failure_mode_history_report', async (req, res) => {
  const { FailureAnalysis_ID, Document_ID, model_name, version_date } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO FailureModeHistoryReport (HistoryReport_ID, FailureAnalysis_ID, Document_ID, model_name, version_date) VALUES ($1, $2, $3, $4, $5)`,
      [id, FailureAnalysis_ID, Document_ID, model_name, version_date]
    );
    res.json({ HistoryReport_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/failure_mode_history_report/:id', async (req, res) => {
  const id = req.params.id;
  const { FailureAnalysis_ID, Document_ID, model_name, version_date } = req.body;
  try {
    await pool.query(
      `UPDATE FailureModeHistoryReport SET FailureAnalysis_ID=$2, Document_ID=$3, model_name=$4, version_date=$5 WHERE HistoryReport_ID=$1`,
      [id, FailureAnalysis_ID, Document_ID, model_name, version_date]
    );
    res.json({ HistoryReport_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/failure_mode_history_report/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM FailureModeHistoryReport WHERE HistoryReport_ID=$1', [id]);
    res.json({ HistoryReport_ID: id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(port, () => {
  console.log(`FMEA API server listening at http://localhost:${port}`);
}); 