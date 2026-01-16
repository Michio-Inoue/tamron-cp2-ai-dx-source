class ModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('3Dビューアーのコンテナが見つかりません');
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.model = null;
        this.dimensions = [];
        
        this.init();
    }

    init() {
        try {
            // レンダラーの設定
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.setClearColor(0xf8f9fa);
            this.container.appendChild(this.renderer.domElement);

            // カメラの位置設定
            this.camera.position.z = 5;

            // ライトの設定
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            this.scene.add(directionalLight);

            // コントロールの設定
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;

            // アニメーションループ
            this.animate();

            // ウィンドウリサイズ時の処理
            window.addEventListener('resize', () => this.onWindowResize());

            // ファイル選択イベントの設定
            this.setupFileInput();
        } catch (error) {
            console.error('3Dビューアーの初期化に失敗しました:', error);
        }
    }

    setupFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.gltf,.glb,.stl,.xvl';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        this.container.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.loadModel(file);
            }
        });
    }

    loadModel(file) {
        try {
            const reader = new FileReader();
            const fileExtension = file.name.split('.').pop().toLowerCase();
            console.log('選択されたファイル形式:', fileExtension);

            // サポートされていないファイル形式のチェック
            const supportedFormats = ['gltf', 'glb', 'stl', 'xvl'];
            if (!supportedFormats.includes(fileExtension)) {
                console.error(`サポートされていないファイル形式です: ${fileExtension}`);
                console.error('サポートされている形式: .gltf, .glb, .stl, .xvl');
                alert(`サポートされていないファイル形式です: ${fileExtension}\n\nサポートされている形式:\n- .gltf (GL Transmission Format)\n- .glb (Binary GL Transmission Format)\n- .stl (STereoLithography)\n- .xvl (eXtensible Virtual world description Language)`);
                return;
            }

            reader.onload = (event) => {
                const data = event.target.result;
                let geometry;

                switch (fileExtension) {
                    case 'stl':
                        geometry = this.loadSTL(data);
                        break;
                    case 'xvl':
                        geometry = this.loadXVL(data);
                        break;
                    case 'gltf':
                    case 'glb':
                        this.loadGLTF(file);
                        return;
                }

                if (geometry) {
                    this.createMesh(geometry);
                }
            };

            // ファイル形式に応じた読み込み方法を選択
            if (fileExtension === 'stl' || fileExtension === 'xvl') {
                reader.readAsArrayBuffer(file);
            } else if (fileExtension === 'gltf' || fileExtension === 'glb') {
                reader.readAsArrayBuffer(file);
            }
        } catch (error) {
            console.error('モデルの読み込みに失敗しました:', error);
            alert('モデルの読み込みに失敗しました。\n詳細: ' + error.message);
        }
    }

    loadSTL(data) {
        try {
            if (typeof THREE.STLLoader === 'undefined') {
                console.error('STLローダーが読み込まれていません');
                alert('STLローダーが読み込まれていません。ページを再読み込みしてください。');
                return null;
            }

            const loader = new THREE.STLLoader();
            const geometry = loader.parse(data);
            
            if (!geometry) {
                console.error('STLファイルの解析に失敗しました');
                alert('STLファイルの解析に失敗しました。ファイルが正しい形式か確認してください。');
                return null;
            }

            return geometry;
        } catch (error) {
            console.error('STLファイルの読み込みに失敗しました:', error);
            alert('STLファイルの読み込みに失敗しました。\n詳細: ' + error.message);
            return null;
        }
    }

    loadXVL(data) {
        try {
            if (typeof XVLParser === 'undefined') {
                console.error('XVLパーサーが読み込まれていません');
                alert('XVLパーサーが読み込まれていません。ページを再読み込みしてください。');
                return null;
            }

            const parser = new XVLParser();
            const geometry = parser.parse(data);
            
            if (!geometry) {
                console.error('XVLファイルの解析に失敗しました');
                alert('XVLファイルの解析に失敗しました。ファイルが正しい形式か確認してください。');
                return null;
            }

            return geometry;
        } catch (error) {
            console.error('XVLファイルの読み込みに失敗しました:', error);
            alert('XVLファイルの読み込みに失敗しました。\n詳細: ' + error.message);
            return null;
        }
    }

    loadGLTF(file) {
        try {
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.error('GLTFローダーが読み込まれていません');
                alert('GLTFローダーが読み込まれていません。ページを再読み込みしてください。');
                return;
            }

            const loader = new THREE.GLTFLoader();
            const url = URL.createObjectURL(file);
            
            loader.load(
                url,
                (gltf) => {
                    if (this.model) {
                        this.scene.remove(this.model);
                    }
                    this.model = gltf.scene;
                    this.scene.add(this.model);

                    // モデルの中心にカメラを向ける
                    this.centerCamera();
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('GLTFファイルの読み込みに失敗しました:', error);
                    alert('GLTFファイルの読み込みに失敗しました。\n詳細: ' + error.message);
                }
            );
        } catch (error) {
            console.error('GLTFファイルの読み込みに失敗しました:', error);
            alert('GLTFファイルの読み込みに失敗しました。\n詳細: ' + error.message);
        }
    }

    createMesh(geometry) {
        try {
            const material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.7,
                metalness: 0.3
            });
            const mesh = new THREE.Mesh(geometry, material);
            
            if (this.model) {
                this.scene.remove(this.model);
            }
            this.model = mesh;
            this.scene.add(this.model);

            // モデルの中心にカメラを向ける
            this.centerCamera();
        } catch (error) {
            console.error('メッシュの作成に失敗しました:', error);
            alert('メッシュの作成に失敗しました。\n詳細: ' + error.message);
        }
    }

    centerCamera() {
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.tan(fov / 2));
        this.camera.position.z = cameraZ * 1.5;
        this.controls.target.copy(center);
        this.controls.update();
    }

    addDimension(name, value, tolerance) {
        this.dimensions.push({ name, value, tolerance });
        this.updateDimensionDisplay();
    }

    updateDimensionDisplay() {
        const tableBody = document.querySelector('.dimension-table tbody');
        tableBody.innerHTML = '';
        
        this.dimensions.forEach(dim => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dim.name}</td>
                <td>${dim.value}</td>
                <td>±${dim.tolerance}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        const modelViewer = new ModelViewer('model-viewer');
        
        // サンプル寸法データの追加
        modelViewer.addDimension('寸法A', 10.5, 0.1);
        modelViewer.addDimension('寸法B', 25.3, 0.2);
        modelViewer.addDimension('寸法C', 15.8, 0.15);
    } catch (error) {
        console.error('アプリケーションの初期化に失敗しました:', error);
    }
}); 