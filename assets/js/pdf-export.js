// PDF导出功能
class PDFExporter {
    constructor() {
        this.exportWindow = null;
        this.slidesToExport = [];
    }

    // 导出为PDF
    async exportToPDF() {
        try {
            console.log('开始PDF导出...');
            
            // 获取所有slides数据
            if (!window.PPTState || !window.PPTState.slides) {
                throw new Error('没有找到可导出的幻灯片数据');
            }

            this.slidesToExport = window.PPTState.slides;
            
            // 创建导出专用窗口
            await this.createExportWindow();
            
            // 生成打印页面内容
            await this.generatePrintContent();
            
            // 等待内容加载完成
            await this.waitForContentLoad();
            
            // 触发打印
            this.triggerPrint();
            
        } catch (error) {
            console.error('PDF导出失败:', error);
        alert('PDF导出失败: ' + error.message);
        }
    }

    // 创建导出专用窗口
    createExportWindow() {
        return new Promise((resolve) => {
            // 创建新窗口
            this.exportWindow = window.open('', '_blank', 'width=1200,height=800');
            
            if (!this.exportWindow) {
                throw new Error('无法创建导出窗口，请允许弹窗');
            }

            // 基础HTML结构
            this.exportWindow.document.write(`
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>PPT导出 - PDF版本</title>
                    
                    <!-- 引入原有样式 - 使用与slides相同的CDN -->
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    
                    <style>
                        /* PDF专用样式 */
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }

                                                 @page {
                             size: 320mm 180mm; /* 精确的16:9比例 */
                             margin: 0;
                         }

                        body {
                            font-family: 'Inter', sans-serif;
                            margin: 0;
                            padding: 0;
                            background: #000;
                        }

                        .slide-page {
                            width: 100vw;
                            height: 100vh;
                            page-break-after: always;
                            page-break-inside: avoid;
                            position: relative;
                            overflow: hidden !important; /* 强制隐藏滚动条 */
                            background: transparent;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .slide-page:last-child {
                            page-break-after: avoid;
                        }

                        .slide-content {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            overflow: hidden !important; /* 强制隐藏滚动条 */
                        }

                        .slide-iframe {
                            width: 1920px;
                            height: 1080px;
                            border: none;
                            background: transparent;
                            transform: scale(0.65); /* 稍微缩小内容，提供更好的边距 */距 */
                            transform-origin: center center;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            margin-top: -540px; /* -1080/2 */
                            margin-left: -960px; /* -1920/2 */
                        }

                        /* 屏幕显示样式 */
                        @media screen {
                            body {
                                background: #1a1a1a;
                                padding: 20px;
                                overflow-x: hidden; /* 隐藏水平滚动条 */
                            }

                            .slide-page {
                                margin-bottom: 20px;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                                border-radius: 8px;
                                width: 800px;
                                height: 450px; /* 800 * 9 / 16 = 450，保持16:9比例 */
                                aspect-ratio: 16 / 9;
                                overflow: hidden; /* 隐藏滚动条 */
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }

                            .slide-content {
                                overflow: hidden; /* 隐藏滚动条 */
                                width: 100%;
                                height: 100%;
                                position: relative;
                            }

                            .slide-iframe {
                                width: 1920px !important;
                                height: 1080px !important;
                                transform: scale(0.262) !important; /* 屏幕预览缩放 对应打印的0.65比例 */
                                transform-origin: center center !important;
                                position: absolute !important;
                                top: 50% !important;
                                left: 50% !important;
                                margin-top: -540px !important; /* -1080/2 */
                                margin-left: -960px !important; /* -1920/2 */
                                overflow: hidden !important; /* 隐藏滚动条 */
                            }

                            .export-header {
                                text-align: center;
                                margin-bottom: 30px;
                                padding: 20px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }

                            .export-actions {
                                margin-bottom: 20px;
                                text-align: center;
                            }

                            .export-btn {
                                padding: 12px 24px;
                                margin: 0 10px;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 16px;
                                transition: all 0.3s ease;
                            }

                            .export-btn.primary {
                                background: #3b82f6;
                                color: white;
                            }

                            .export-btn.primary:hover {
                                background: #2563eb;
                            }

                            .export-btn.secondary {
                                background: #e5e7eb;
                                color: #374151;
                            }

                            .export-btn.secondary:hover {
                                background: #d1d5db;
                            }
                        }

                        /* 打印时隐藏控制元素 */
                        @media print {
                            * {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            
                            body {
                                background: transparent !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                overflow: hidden !important; /* 隐藏滚动条 */
                            }
                            
                            html {
                                overflow: hidden !important; /* 隐藏滚动条 */
                            }
                            
                            .export-header,
                            .export-actions {
                                display: none !important;
                            }

                            .slide-page {
                                margin: 0 !important;
                                padding: 0 !important;
                                box-shadow: none !important;
                                border-radius: 0 !important;
                                background: transparent !important;
                                width: 100vw !important;
                                height: 100vh !important;
                                page-break-after: always;
                                page-break-inside: avoid;
                                position: relative;
                                overflow: hidden !important; /* 隐藏滚动条 */
                                display: flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                            }
                            
                            .slide-content {
                                width: 100% !important;
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                position: relative;
                                overflow: hidden !important; /* 隐藏滚动条 */
                            }
                            
                            .slide-iframe {
                                transform: scale(0.65) !important; /* 稍微缩小内容，提供更好的边距 */距 */
                                transform-origin: center center !important;
                                position: absolute !important;
                                top: 50% !important;
                                left: 50% !important;
                                margin-top: -540px !important; /* -1080/2 */
                                margin-left: -960px !important; /* -1920/2 */
                                width: 1920px !important;
                                height: 1080px !important;
                                border: none !important;
                                background: transparent !important;
                                overflow: hidden !important; /* 隐藏滚动条 */
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="export-header">
                        <h1>PPT导出预览</h1>
                        <p>共 ${this.slidesToExport.length} 页幻灯片，16:9比例</p>
                    </div>
                    
                    <div class="export-actions">
                        <div class="print-notice" style="background: #fef3c7; color: #92400e; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: left;">
                            <strong>📋 打印设置提醒：</strong><br>
                            在Chrome打印设置中，请务必勾选 <strong>"背景图形"</strong> 选项，否则背景样式将不会显示！
                        </div>
                        <button class="export-btn primary" onclick="window.print()">
                            <i class="fas fa-download"></i> 导出PDF
                        </button>
                        <button class="export-btn secondary" onclick="window.close()">
                            <i class="fas fa-times"></i> 关闭
                        </button>
                    </div>
                    
                    <div id="slides-container">
                        <!-- 幻灯片内容将在这里动态加载 -->
                    </div>
                </body>
                </html>
            `);
            
            this.exportWindow.document.close();
            
            // 等待窗口加载完成
            this.exportWindow.onload = () => {
                resolve();
            };
        });
    }

    // 生成打印内容
    async generatePrintContent() {
        const container = this.exportWindow.document.getElementById('slides-container');
        
        // 为每个slide创建一页
        for (let i = 0; i < this.slidesToExport.length; i++) {
            const slide = this.slidesToExport[i];
            
            const slidePage = this.exportWindow.document.createElement('div');
            slidePage.className = 'slide-page';
            slidePage.innerHTML = `
                <div class="slide-content">
                    <iframe class="slide-iframe" src="${this.getAbsoluteUrl(slide.filepath)}" frameborder="0"></iframe>
                </div>
            `;
            
            container.appendChild(slidePage);
        }
    }

    // 获取绝对URL
    getAbsoluteUrl(relativePath) {
        // 确保使用当前页面的基础URL
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
        return baseUrl + relativePath;
    }

    // 等待内容加载完成
    waitForContentLoad() {
        return new Promise((resolve) => {
            const iframes = this.exportWindow.document.querySelectorAll('.slide-iframe');
            let loadedCount = 0;
            
            const checkTailwindReady = () => {
                // 检查Tailwind CSS是否已加载
                try {
                    const testEl = this.exportWindow.document.createElement('div');
                    testEl.className = 'bg-purple-500';
                    testEl.style.visibility = 'hidden';
                    this.exportWindow.document.body.appendChild(testEl);
                    
                    const computed = this.exportWindow.getComputedStyle(testEl);
                    const bgColor = computed.backgroundColor;
                    this.exportWindow.document.body.removeChild(testEl);
                    
                    // 如果背景色是紫色，说明Tailwind已加载
                    if (bgColor.includes('147, 51, 234') || bgColor.includes('purple')) {
                        console.log('Tailwind CSS is ready');
                        return true;
                    }
                } catch (e) {
                    console.log('Tailwind check failed:', e);
                }
                return false;
            };
            
            const checkAllLoaded = () => {
                loadedCount++;
                console.log(`Loaded ${loadedCount}/${iframes.length} iframes`);
                if (loadedCount >= iframes.length) {
                    // 检查Tailwind CSS是否就绪
                    const checkCSS = () => {
                        if (checkTailwindReady()) {
                            console.log('PDF export ready');
                            resolve();
                        } else {
                            console.log('Waiting for Tailwind CSS...');
                            setTimeout(checkCSS, 1000);
                        }
                    };
                    
                    // 给一些初始时间让CSS加载
                    setTimeout(checkCSS, 2000);
                }
            };

            if (iframes.length === 0) {
                console.log('No iframes found');
                resolve();
                return;
            }

            iframes.forEach((iframe, index) => {
                iframe.onload = () => {
                    console.log(`Iframe ${index + 1} loaded successfully`);
                    checkAllLoaded();
                };
                iframe.onerror = () => {
                    console.log(`Iframe ${index + 1} failed to load`);
                    checkAllLoaded();
                };
                
                // 设置超时，避免某些iframe加载失败时卡住
                setTimeout(() => {
                    console.log(`Timeout for iframe ${index + 1}`);
                    checkAllLoaded();
                }, 10000);
            });
        });
    }

    // 触发打印
    triggerPrint() {
        // 聚焦到导出窗口
        this.exportWindow.focus();
        
        // 延迟触发打印，确保窗口完全加载
        setTimeout(() => {
            // 在主窗口显示提醒
            alert('即将打开打印对话框\n\n重要提醒：请在打印设置中勾选"背景图形"选项，确保背景样式正常显示！');
            this.exportWindow.print();
        }, 500);
    }
}

// 创建全局实例
window.pdfExporter = new PDFExporter();

// 导出函数供HTML调用
function exportToPDF() {
    if (window.pdfExporter) {
        window.pdfExporter.exportToPDF();
    } else {
        console.error('PDF导出器未初始化');
        alert('PDF导出功能未就绪，请稍后再试');
    }
}

// 导出到全局作用域
window.exportToPDF = exportToPDF; 