const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class GiteaAPI {
  constructor(config) {
    this.config = config;
    this.baseURL = config.serverUrl;
    this.token = config.token;
  }

  // Giteaサーバーの接続テスト
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/version`, {
        headers: {
          'Authorization': `token ${this.token}`
        }
      });
      return {
        success: true,
        version: response.data.version,
        message: '接続成功'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  // リポジトリの存在確認
  async checkRepository(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${this.token}`
        }
      });
      return {
        success: true,
        repository: response.data,
        message: 'リポジトリが見つかりました'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'リポジトリが見つかりません'
      };
    }
  }

  // ファイルをアップロード
  async uploadFile(filePath, targetPath, branch = 'main', message = 'Upload via API') {
    try {
      const fileContent = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      
      // ファイルの内容をBase64エンコード
      const content = fileContent.toString('base64');
      
      const payload = {
        message: message,
        content: content,
        branch: branch
      };

      const response = await axios.post(
        `${this.baseURL}/api/v1/repos/${this.config.repoOwner}/${this.config.repoName}/contents/${targetPath}`,
        payload,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data,
        message: 'ファイルが正常にアップロードされました'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  // 複数ファイルを一括アップロード
  async uploadMultipleFiles(files, branch = 'main') {
    const results = [];
    
    for (const file of files) {
      const result = await this.uploadFile(
        file.path,
        file.targetPath || file.name,
        branch,
        `Upload ${file.name} via API`
      );
      
      results.push({
        file: file.name,
        ...result
      });
    }
    
    return results;
  }

  // ブランチの一覧を取得
  async getBranches() {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/repos/${this.config.repoOwner}/${this.config.repoName}/branches`,
        {
          headers: {
            'Authorization': `token ${this.token}`
          }
        }
      );
      
      return {
        success: true,
        branches: response.data,
        message: 'ブランチ一覧を取得しました'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  // 新しいブランチを作成
  async createBranch(branchName, sourceBranch = 'main') {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/repos/${this.config.repoOwner}/${this.config.repoName}/branches`,
        {
          new_branch_name: branchName,
          old_branch_name: sourceBranch
        },
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        branch: response.data,
        message: 'ブランチが作成されました'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  // プルリクエストを作成
  async createPullRequest(title, body, headBranch, baseBranch = 'main') {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/repos/${this.config.repoOwner}/${this.config.repoName}/pulls`,
        {
          title: title,
          body: body,
          head: headBranch,
          base: baseBranch
        },
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        pullRequest: response.data,
        message: 'プルリクエストが作成されました'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
}

module.exports = GiteaAPI; 