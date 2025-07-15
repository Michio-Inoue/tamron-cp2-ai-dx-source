import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Warning,
  Delete,
  Visibility,
  Settings,
  GitHub
} from '@mui/icons-material';
import axios from 'axios';

const GiteaUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [giteaConfig, setGiteaConfig] = useState({
    serverUrl: '',
    token: '',
    username: '',
    repoOwner: '',
    repoName: '',
    branch: 'main'
  });
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [eslintResults, setEslintResults] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === ',') {
        event.preventDefault();
        setConfigDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      eslintIssues: []
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/javascript': ['.js', '.jsx', '.ts', '.tsx'],
      'text/html': ['.html'],
      'text/css': ['.css'],
      'application/json': ['.json']
    },
    multiple: true
  });

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const runEslintCheck = async (file) => {
    try {
      // ESLintチェックのシミュレーション（実際の実装ではESLintライブラリを使用）
      const issues = [];
      const content = await file.text();
      
      // 簡単なチェック例
      if (content.includes('console.log')) {
        issues.push({
          line: content.split('\n').findIndex(line => line.includes('console.log')) + 1,
          message: 'console.logの使用は推奨されません',
          severity: 'warning'
        });
      }
      
      if (content.includes('var ')) {
        issues.push({
          line: content.split('\n').findIndex(line => line.includes('var ')) + 1,
          message: 'varの代わりにconst/letを使用してください',
          severity: 'error'
        });
      }

      return issues;
    } catch (error) {
      console.error('ESLint check failed:', error);
      return [];
    }
  };

  const checkAllFiles = async () => {
    setUploading(true);
    const results = [];

    for (const fileObj of files) {
      const issues = await runEslintCheck(fileObj.file);
      fileObj.eslintIssues = issues;
      fileObj.status = issues.length === 0 ? 'ready' : 'has-issues';
      results.push({ file: fileObj.file.name, issues });
    }

    setEslintResults(results);
    setUploading(false);
  };

  const uploadToGitea = async () => {
    if (!giteaConfig.serverUrl || !giteaConfig.token) {
      alert('Giteaサーバーの設定を完了してください');
      return;
    }

    setUploading(true);
    const results = [];

    try {
      // バックエンドAPIを使用してファイルをアップロード
      const formData = new FormData();
      
      // アップロード対象のファイルのみを追加
      const filesToUpload = files.filter(f => f.status !== 'has-issues');
      
      filesToUpload.forEach(fileObj => {
        formData.append('files', fileObj.file);
      });
      
      // 設定情報を追加
      formData.append('serverUrl', giteaConfig.serverUrl);
      formData.append('token', giteaConfig.token);
      formData.append('repoOwner', giteaConfig.repoOwner);
      formData.append('repoName', giteaConfig.repoName);
      formData.append('branch', giteaConfig.branch);
      formData.append('message', 'Upload via Gitea Uploader App');

      const response = await axios.post('http://localhost:8080/api/gitea/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        response.data.results.forEach(result => {
          results.push(result);
          
          // ファイルのステータスを更新
          const fileObj = files.find(f => f.file.name === result.file);
          if (fileObj) {
            fileObj.status = result.success ? 'uploaded' : 'error';
          }
        });
      } else {
        results.push({
          file: '全体',
          success: false,
          message: response.data.message
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      results.push({
        file: '全体',
        success: false,
        message: error.response?.data?.message || error.message
      });
    }

    setUploadResults(results);
    setUploading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle color="success" />;
      case 'has-issues':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <CloudUpload color="primary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded':
        return 'success';
      case 'has-issues':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const testConnection = async () => {
    if (!giteaConfig.serverUrl || !giteaConfig.token) {
      alert('サーバーURLとトークンを入力してください');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/gitea/test-connection', {
        serverUrl: giteaConfig.serverUrl,
        token: giteaConfig.token
      });

      setConnectionStatus(response.data);
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error.response?.data?.message || '接続テストに失敗しました'
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GitHub />
          Gitea プッシュアプリ
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            設定
          </Typography>
          <Tooltip title="Gitea設定 (Ctrl+,)">
            <IconButton 
              onClick={() => setConfigDialogOpen(true)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                width: 48,
                height: 48,
                boxShadow: 2
              }}
            >
              <Settings sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Gitea設定ダイアログ */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings />
          Giteaサーバー設定
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Giteaサーバーへの接続に必要な情報を入力してください。設定後は「接続テスト」で確認できます。
          </Typography>
          <TextField
            fullWidth
            label="GiteaサーバーURL"
            value={giteaConfig.serverUrl}
            onChange={(e) => setGiteaConfig(prev => ({ ...prev, serverUrl: e.target.value }))}
            margin="normal"
            placeholder="https://gitea.example.com"
          />
          <TextField
            fullWidth
            label="アクセストークン"
            type="password"
            value={giteaConfig.token}
            onChange={(e) => setGiteaConfig(prev => ({ ...prev, token: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ユーザー名"
            value={giteaConfig.username}
            onChange={(e) => setGiteaConfig(prev => ({ ...prev, username: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="リポジトリオーナー"
            value={giteaConfig.repoOwner}
            onChange={(e) => setGiteaConfig(prev => ({ ...prev, repoOwner: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="リポジトリ名"
            value={giteaConfig.repoName}
            onChange={(e) => setGiteaConfig(prev => ({ ...prev, repoName: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ブランチ"
            value={giteaConfig.branch}
            onChange={(e) => setGiteaConfig(prev => ({ ...prev, branch: e.target.value }))}
            margin="normal"
            defaultValue="main"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={testConnection} variant="outlined">接続テスト</Button>
          <Button onClick={() => setConfigDialogOpen(false)}>キャンセル</Button>
          <Button onClick={() => setConfigDialogOpen(false)} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>

      {/* 接続ステータス表示 */}
      {connectionStatus && (
        <Alert 
          severity={connectionStatus.success ? 'success' : 'error'} 
          sx={{ mb: 2 }}
          onClose={() => setConnectionStatus(null)}
        >
          {connectionStatus.message}
          {connectionStatus.version && ` (Gitea v${connectionStatus.version})`}
        </Alert>
      )}

      {/* ドラッグ&ドロップエリア */}
      <Paper
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'ファイルをドロップしてください' : 'ファイルをドラッグ&ドロップまたはクリックして選択'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          対応形式: .js, .jsx, .ts, .tsx, .html, .css, .json
        </Typography>
      </Paper>

      {/* ファイルリスト */}
      {files.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            選択されたファイル ({files.length})
          </Typography>
          <List>
            {files.map((fileObj) => (
              <ListItem
                key={fileObj.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={fileObj.status}
                      color={getStatusColor(fileObj.status)}
                      size="small"
                    />
                    <IconButton onClick={() => removeFile(fileObj.id)} size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  {getStatusIcon(fileObj.status)}
                </ListItemIcon>
                <ListItemText
                  primary={fileObj.file.name}
                  secondary={`${(fileObj.file.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* アクションボタン */}
      {files.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={checkAllFiles}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <Visibility />}
          >
            ESLintチェック
          </Button>
          <Button
            variant="contained"
            onClick={uploadToGitea}
            disabled={uploading || files.some(f => f.status === 'has-issues')}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          >
            Giteaにプッシュ
          </Button>
        </Box>
      )}

      {/* ESLint結果 */}
      {eslintResults.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ESLintチェック結果
          </Typography>
          {eslintResults.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {result.file}
              </Typography>
              {result.issues.length === 0 ? (
                <Alert severity="success">問題なし</Alert>
              ) : (
                result.issues.map((issue, issueIndex) => (
                  <Alert key={issueIndex} severity={issue.severity} sx={{ mt: 1 }}>
                    行 {issue.line}: {issue.message}
                  </Alert>
                ))
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* アップロード結果 */}
      {uploadResults.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            アップロード結果
          </Typography>
          {uploadResults.map((result, index) => (
            <Alert
              key={index}
              severity={result.success ? 'success' : 'error'}
              sx={{ mb: 1 }}
            >
              {result.file}: {result.message}
            </Alert>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default GiteaUploader; 