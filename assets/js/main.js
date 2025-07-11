/**
 * HTML PPT 模板 - 主要功能脚本
 * 
 * 实现PPT的核心功能：
 * - 幻灯片导航
 * - 主题切换
 * - 全屏控制
 * - 侧边栏管理
 * - 进度跟踪
 */

// 全局状态管理
const PPTState = {
    currentSlide: 0,
    totalSlides: 0,
    isFullscreen: false,
    isSidebarOpen: false,
    isPresenting: false,
    settings: {},
    slides: []
};

// 初始化PPT
function initializePPT() {
    // 获取配置
    PPTState.settings = PPTConfig.settings;
    
    // 初始化sidebar状态 - 默认展开
    PPTState.isSidebarOpen = true;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.add('open');
    }
    
    // 恢复用户选择的文件夹（异步操作）
    restoreUserFolder().then(() => {
        // 加载幻灯片内容
        loadSlideContent();
    }).catch((error) => {
        console.error('恢复用户文件夹失败:', error);
        // 即使恢复失败，也继续加载默认内容
        loadSlideContent();
    });
    
    // 初始化界面
    updateSlideCounter();
    updateProgress();
    updateSlideTitle();
    
    // 绑定事件
    bindEvents();
    
    // 检查移动端
    checkMobileDevice();
    
    // 初始化slide viewport尺寸
    setTimeout(() => {
        adjustSlideViewport();
    }, 100);
    
    // 也在稍后再次调整，确保iframe内容加载完成后正确缩放
    setTimeout(() => {
        adjustSlideViewport();
    }, 1000);
    
    // 初始化缩放控制器
    initializeZoomController();
    
    // 初始化侧边栏区域
    initializeSidebarSections();
    
    console.log('PPT initialized successfully');
}

// 加载幻灯片内容
function loadSlideContent() {
    try {
        // 使用slideFiles配置来加载HTML文件
        if (PPTConfig.slideFiles && PPTConfig.slideFiles.files) {
            const slideFiles = PPTConfig.slideFiles.files;
            
            // 构建幻灯片信息数组
            const slides = slideFiles.map((filename, index) => {
                // 从文件名提取标题
                let title = `幻灯片 ${index + 1}`;
                const nameWithoutExt = filename.replace('.html', '');
                const parts = nameWithoutExt.split('-');
                if (parts.length > 1) {
                    title = parts.slice(1).join(' ').replace(/[-_]/g, ' ');
                }
                
                return {
                    id: `slide-${index}`,
                    title: title,
                    filename: filename,
                    filepath: PPTConfig.slideFiles.basePath + filename,
                    notes: '' // 备注需要从iframe中获取，先设为空
                };
            });
            
            // 更新slides数组信息
            updateSlidesInfo(slides);
            
            // 设置第一张幻灯片
            if (slides.length > 0) {
                loadSlideByIndex(0);
            }
            
            console.log('Slide files loaded:', slides.length + ' slides');
            return;
        }
        
        throw new Error('没有找到可用的幻灯片文件配置');
        
    } catch (error) {
        console.error('加载幻灯片内容时出错:', error);
        // 加载失败时显示错误信息
        showErrorMessage('无法加载幻灯片内容: ' + error.message);
    }
}

// 通过索引加载幻灯片
function loadSlideByIndex(index) {
    if (index < 0 || index >= PPTState.totalSlides) return;
    
    const slide = PPTState.slides[index];
    const slideFrame = document.getElementById('slide-frame');
    
    if (slideFrame && slide) {
        slideFrame.src = slide.filepath;
        PPTState.currentSlide = index;
        
        // 更新界面
        updateSlideCounter();
        updateProgress();
        updateSlideTitle();
        updateActiveNavigation();
        
        // 更新侧边栏缩略图当前状态
        if (window.sidebarThumbnails) {
            window.sidebarThumbnails.currentSlide = index;
            window.sidebarThumbnails.updateActiveSlide();
        }
        
        // iframe加载完成后的处理
        setTimeout(() => {
            // 重新应用缩放以确保新加载的内容正确显示
            adjustSlideViewport();
        }, 500);
        
        console.log('Loaded slide:', slide.filename);
    }
}





// 更新幻灯片信息
function updateSlidesInfo(slidesData) {
    PPTState.slides = slidesData;
    PPTState.totalSlides = slidesData.length;
    PPTState.currentSlide = 0;
    
    // 通知新的侧边栏缩略图管理器更新
    if (window.sidebarThumbnails) {
        setTimeout(() => {
            window.sidebarThumbnails.updateSidebarNavigation();
        }, 100);
    }
}





// 显示错误信息
function showErrorMessage(message) {
    const slideFrame = document.getElementById('slide-frame');
    if (slideFrame) {
        // 创建一个临时的错误页面
        const errorContent = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>加载错误</title>
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 40px; background: #f8f9fa; }
                    .error-container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    h2 { color: #dc3545; margin-bottom: 20px; }
                    .solution { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .solution h4 { color: #007bff; margin-bottom: 10px; }
                    ul { list-style: none; padding: 0; }
                    li { padding: 8px 0; color: #6c757d; }
                    li:before { content: "✓ "; color: #28a745; font-weight: bold; margin-right: 8px; }
                    code { background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: 'Consolas', monospace; }
                    .browser-tip { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .browser-tip h4 { color: #856404; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h2>⚠️ 无法加载幻灯片</h2>
                    <p>${message}</p>
                    <div class="browser-tip">
                        <h4>💡 这可能是浏览器安全限制</h4>
                        <p>部分浏览器会阻止本地文件访问。推荐使用以下浏览器：</p>
                        <ul style="margin-left: 20px;">
                            <li><strong>Chrome浏览器</strong> - 兼容性最好</li>
                            <li><strong>Firefox浏览器</strong> - 支持良好</li>
                            <li><strong>Edge浏览器</strong> - 微软推荐</li>
                        </ul>
                    </div>
                    <div class="solution">
                        <h4>🚀 快速解决方案：</h4>
                        <ol style="list-style: decimal; margin-left: 20px; color: #6c757d;">
                            <li>点击文件夹选择器，先切换回"slides (默认)"</li>
                            <li>如果还是不行，尝试刷新页面</li>
                            <li>确保项目文件夹完整，所有文件都在</li>
                            <li>尝试用不同的浏览器打开</li>
                        </ol>
                    </div>
                    <p><strong>💡 小贴士：</strong>这是零依赖项目，直接双击 <code>index.html</code> 即可使用，无需安装任何软件！</p>
                </div>
            </body>
            </html>
        `;
        
        slideFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(errorContent);
    }
    
    PPTState.slides = [{
        id: 'error',
        title: '错误',
        layout: 'content'
    }];
    PPTState.totalSlides = 1;
    PPTState.currentSlide = 0;
}

// 绑定事件监听器
function bindEvents() {
    // 全屏状态监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // 触摸手势支持
    if (PPTState.settings.touch) {
        bindTouchEvents();
    }
    
    // 窗口大小改变
    window.addEventListener('resize', handleResize);
}

// 触摸事件绑定
function bindTouchEvents() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    const slideContainer = document.querySelector('.slide-container');
    
    slideContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });
    
    slideContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const deltaTime = endTime - startTime;
        
        // 检查是否为有效的滑动手势
        if (deltaTime < 500 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    });
}

// 幻灯片导航
function goToSlide(index) {
    loadSlideByIndex(index);
}

// 更新导航项的激活状态
function updateActiveNavigation() {
    // 通知新的侧边栏缩略图管理器更新激活状态
    if (window.sidebarThumbnails) {
        window.sidebarThumbnails.updateActiveSlide();
    }
}

function nextSlide() {
    // 如果有重新排列的幻灯片顺序，使用自定义顺序
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder && window.sidebarThumbnails.slideOrder.length > 0) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        const currentPos = currentOrder.indexOf(PPTState.currentSlide);
        
        if (currentPos !== -1) {
            const nextPos = currentPos + 1;
            if (nextPos < currentOrder.length) {
                goToSlide(currentOrder[nextPos]);
            } else if (PPTState.settings && PPTState.settings.loop) {
                goToSlide(currentOrder[0]);
            }
            return;
        }
    }
    
    // 默认顺序
    const nextIndex = PPTState.currentSlide + 1;
    if (nextIndex < PPTState.totalSlides) {
        goToSlide(nextIndex);
    } else if (PPTState.settings && PPTState.settings.loop) {
        goToSlide(0);
    }
}

function prevSlide() {
    // 如果有重新排列的幻灯片顺序，使用自定义顺序
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder && window.sidebarThumbnails.slideOrder.length > 0) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        const currentPos = currentOrder.indexOf(PPTState.currentSlide);
        
        if (currentPos !== -1) {
            const prevPos = currentPos - 1;
            if (prevPos >= 0) {
                goToSlide(currentOrder[prevPos]);
            } else if (PPTState.settings && PPTState.settings.loop) {
                goToSlide(currentOrder[currentOrder.length - 1]);
            }
            return;
        }
    }
    
    // 默认顺序
    const prevIndex = PPTState.currentSlide - 1;
    if (prevIndex >= 0) {
        goToSlide(prevIndex);
    } else if (PPTState.settings && PPTState.settings.loop) {
        goToSlide(PPTState.totalSlides - 1);
    }
}

function firstSlide() {
    // 如果有重新排列的幻灯片顺序，跳转到第一个
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        if (currentOrder.length > 0) {
            goToSlide(currentOrder[0]);
            return;
        }
    }
    
    goToSlide(0);
}

function lastSlide() {
    // 如果有重新排列的幻灯片顺序，跳转到最后一个
    if (window.sidebarThumbnails && window.sidebarThumbnails.slideOrder) {
        const currentOrder = window.sidebarThumbnails.slideOrder;
        if (currentOrder.length > 0) {
            goToSlide(currentOrder[currentOrder.length - 1]);
            return;
        }
    }
    
    goToSlide(PPTState.totalSlides - 1);
}

// 更新界面元素
function updateSlideCounter() {
    const currentSlideElements = [
        document.getElementById('current-slide'),
        document.getElementById('current-slide-overlay')
    ];
    const totalSlidesElements = [
        document.getElementById('total-slides'),
        document.getElementById('total-slides-overlay')
    ];
    
    const currentSlideNumber = PPTState.currentSlide + 1;
    const totalSlideNumber = PPTState.totalSlides;
    
    currentSlideElements.forEach(el => {
        if (el) el.textContent = currentSlideNumber;
    });
    
    totalSlidesElements.forEach(el => {
        if (el) el.textContent = totalSlideNumber;
    });
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progress = ((PPTState.currentSlide + 1) / PPTState.totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function updateSlideTitle() {
    // 幻灯片标题已被移除，保留此函数以维持兼容性
    // 如果将来需要显示标题，可以在这里重新实现
}

// 更新演讲者备注




// 侧边栏管理
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const mainToggleBtns = document.querySelectorAll('[onclick="toggleSidebar()"]');
    
    PPTState.isSidebarOpen = !PPTState.isSidebarOpen;
    
    if (PPTState.isSidebarOpen) {
        sidebar.classList.add('open');
        // Sidebar内的关闭按钮显示X
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        }
        // 主控制栏的菜单按钮显示X
        mainToggleBtns.forEach(btn => {
            if (btn !== toggleBtn && btn.closest('.control-bar')) {
                btn.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
    } else {
        sidebar.classList.remove('open');
        // Sidebar内的关闭按钮显示菜单图标
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
        // 主控制栏的菜单按钮显示菜单图标
        mainToggleBtns.forEach(btn => {
            if (btn !== toggleBtn && btn.closest('.control-bar')) {
                btn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    PPTState.isSidebarOpen = false;
    sidebar.classList.remove('open');
}

// 修复PDF导出功能
function showPresentationTimer() {
    // 显示演示计时器
    if (window.presentationTimer) {
        window.presentationTimer.show();
    } else {
        showToast('演示计时器功能正在开发中', 2000);
    }
}

// 重置幻灯片顺序
function resetSlideOrder() {
    // 重新加载幻灯片内容，恢复默认顺序
    loadSlideContent();
    showToast('幻灯片顺序已重置', 2000);
}

// 全屏控制
function toggleFullscreen() {
    if (!PPTState.isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function handleFullscreenChange() {
    PPTState.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
    
    const fullscreenBtn = document.querySelector('[onclick="toggleFullscreen()"]');
    if (fullscreenBtn) {
        const icon = fullscreenBtn.querySelector('i');
        if (PPTState.isFullscreen) {
            icon.className = 'fas fa-compress';
            fullscreenBtn.title = '退出全屏 (Esc)';
        } else {
            icon.className = 'fas fa-expand';
            fullscreenBtn.title = '全屏 (F11)';
        }
    }
    
    // 全屏时隐藏除幻灯片外的所有UI元素
    const body = document.body;
    if (PPTState.isFullscreen) {
        body.classList.add('fullscreen-mode');
        // 进入全屏时应用100%缩放
        setTimeout(() => {
            adjustSlideViewport();
        }, 100);
    } else {
        body.classList.remove('fullscreen-mode');
        // 退出全屏时重新应用用户的缩放设置
        setTimeout(() => {
            adjustSlideViewport();
        }, 100);
    }
}



// 帮助模态框
function showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 黑客松信息弹窗
function showHackathonInfo() {
    const modal = document.getElementById('hackathon-info-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeHackathonInfo() {
    const modal = document.getElementById('hackathon-info-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 欢迎界面
function startTutorial() {
    closeWelcome();
    // 可以在这里添加引导教程逻辑
}

function closeWelcome() {
    const overlay = document.getElementById('welcome-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// 设备检测
function checkMobileDevice() {
    const isMobile = window.innerWidth < PPTConfig.breakpoints.mobile;
    const isTablet = window.innerWidth < PPTConfig.breakpoints.tablet;
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    
    // 移动端自动隐藏侧边栏
    if (isMobile) {
        closeSidebar();
    }
}

// 窗口大小改变处理
function handleResize() {
    checkMobileDevice();
    
    // 延迟执行以避免频繁调用
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // 重新计算布局
        updateSlideLayout();
        // 调整slide viewport尺寸
        adjustSlideViewport();
    }, 150); // 减少延迟，让响应更快
}

function updateSlideLayout() {
    // 这里可以添加布局更新逻辑
    console.log('Layout updated');
}

// 调整slide viewport尺寸以适应窗口
function adjustSlideViewport() {
    const slideContainer = document.querySelector('.slide-container');
    const slideViewport = document.querySelector('.slide-viewport');
    
    if (!slideContainer || !slideViewport) return;
    
    // 使用CSS的aspect-ratio和max-height自动处理大部分情况
    // 只需要调整少量的CSS属性来适应不同的窗口尺寸
    
    const containerRect = slideContainer.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const isSmallWindow = window.innerWidth < 1200;
    
    // 动态调整padding以适应不同窗口大小
    let padding;
    if (containerRect.width < 500) {
        padding = 4; // 极小窗口
    } else if (isMobile) {
        padding = 8; // 移动端
    } else if (isSmallWindow) {
        padding = 16; // 小窗口
    } else {
        padding = 24; // 大窗口
    }
    
    slideContainer.style.padding = `${padding}px`;
    
    // 调整最大高度以确保在小窗口中也能正常显示
    const maxHeight = Math.max(200, containerRect.height - padding * 2);
    slideViewport.style.maxHeight = `${maxHeight}px`;

    // 根据16:9比例计算可接受的最大宽度，避免在宽度受限时向右溢出
    const maxWidthByRatio = maxHeight * (16 / 9);
    const availableWidth = containerRect.width - padding * 2;
    const maxWidth = Math.min(availableWidth, maxWidthByRatio);
    slideViewport.style.maxWidth = `${maxWidth}px`;

    // 如果可用宽度非常小，允许viewport自动缩放宽度
    if (availableWidth < maxWidthByRatio) {
        slideViewport.style.width = `${availableWidth}px`;
    } else {
        slideViewport.style.width = '100%';
    }
    
    // 简化iframe的缩放逻辑
    adjustIframeContent();
    
    console.log(`Adjusted viewport: max-height: ${maxHeight}px, padding: ${padding}px`);
}

// 简化的iframe内容调整
function adjustIframeContent() {
    const slideViewport = document.querySelector('.slide-viewport');
    if (!slideViewport) return;

    // 在全屏模式下强制使用100%缩放，非全屏模式使用用户设置
    let scaleMultiplier;
    if (PPTState.isFullscreen) {
        scaleMultiplier = 1.0; // 全屏时强制100%
    } else {
        scaleMultiplier = window.PPTState?.userScaleMultiplier || 1.0; // 非全屏时使用用户设置
    }

    if (scaleMultiplier !== 1.0) {
        slideViewport.style.transform = `scale(${scaleMultiplier})`;
        slideViewport.style.transformOrigin = 'center';
    } else {
        slideViewport.style.transform = 'none';
    }
    
    console.log(`Adjusted viewport scale: ${scaleMultiplier} (user setting: ${window.PPTState?.userScaleMultiplier || 1.0}, fullscreen: ${PPTState.isFullscreen})`);
}



// 重置iframe缩放（用于全屏模式）- 已废弃
// 现在全屏模式通过CSS控制，不再需要JavaScript重置用户缩放设置
function resetIframeScaling() {
    // 已废弃：全屏模式现在保持用户的缩放设置
    console.log('resetIframeScaling is deprecated - fullscreen mode now preserves user zoom settings');
}



// 功能按钮处理




function openReadme() {
    // 在新窗口中打开README文件
    window.open('README.md', '_blank');
}

// 导出功能 - 现在由pdf-export.js处理

// 性能监控
function logPerformance() {
    if (performance.mark) {
        performance.mark('ppt-ready');
        
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        
        console.log(`PPT loaded in ${loadTime}ms`);
    }
}

// 错误处理
function handleError(error) {
            console.error('PPT系统错误:', error);
    
    // 在生产环境中，可以发送错误报告
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
            'description': error.message,
            'fatal': false
        });
    }
}

// 在页面加载完成后进行性能监控
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(logPerformance, 100);
});

// 缩放控制器功能
function initializeZoomController() {
    // 新的sidebar缩放控制器
    const sidebarZoomOutBtn = document.getElementById('sidebar-zoom-out');
    const sidebarZoomInBtn = document.getElementById('sidebar-zoom-in');
    const sidebarZoomResetBtn = document.getElementById('sidebar-zoom-reset');
    const sidebarZoomDisplay = document.getElementById('sidebar-zoom-display');
    
    // 兼容旧的缩放控制器（如果存在）
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const zoomDisplay = document.getElementById('zoom-display');
    
    if (!sidebarZoomOutBtn || !sidebarZoomInBtn || !sidebarZoomResetBtn || !sidebarZoomDisplay) {
        console.warn('Sidebar缩放控制器元素未找到，跳过初始化');
        return;
    }
    
    // 从localStorage获取保存的缩放倍数
    const savedScale = localStorage.getItem('ppt-zoom-scale');
    window.PPTState.userScaleMultiplier = savedScale ? parseFloat(savedScale) : 1.0;
    updateZoomDisplay();
    
    // Sidebar缩小按钮
    sidebarZoomOutBtn.addEventListener('click', () => {
        window.PPTState.userScaleMultiplier = Math.max(0.2, window.PPTState.userScaleMultiplier - 0.1);
        updateZoomAndSave();
    });
    
    // Sidebar放大按钮
    sidebarZoomInBtn.addEventListener('click', () => {
        window.PPTState.userScaleMultiplier = Math.min(3.0, window.PPTState.userScaleMultiplier + 0.1);
        updateZoomAndSave();
    });
    
    // Sidebar重置按钮
    sidebarZoomResetBtn.addEventListener('click', () => {
        window.PPTState.userScaleMultiplier = 1.0;
        updateZoomAndSave();
    });
    
    // 兼容旧控制器
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            window.PPTState.userScaleMultiplier = Math.max(0.2, window.PPTState.userScaleMultiplier - 0.1);
            updateZoomAndSave();
        });
    }
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            window.PPTState.userScaleMultiplier = Math.min(3.0, window.PPTState.userScaleMultiplier + 0.1);
            updateZoomAndSave();
        });
    }
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            window.PPTState.userScaleMultiplier = 1.0;
            updateZoomAndSave();
        });
    }
    
    function updateZoomAndSave() {
        updateZoomDisplay();
        localStorage.setItem('ppt-zoom-scale', window.PPTState.userScaleMultiplier.toString());
        
        // 使用新的iframe内容调整功能
        adjustIframeContent();
    }
    
    function updateZoomDisplay() {
        const percentage = Math.round(window.PPTState.userScaleMultiplier * 100);
        // 更新sidebar显示
        if (sidebarZoomDisplay) {
            sidebarZoomDisplay.textContent = `${percentage}%`;
        }
        // 兼容旧显示
        if (zoomDisplay) {
            zoomDisplay.textContent = `${percentage}%`;
        }
    }
}

// 全局错误处理
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason);
});

// 显示Toast消息
function showToast(message, duration = 3000) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 设置样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// 文件夹选择功能
function showFolderSelector() {
    // 先加载PPT画廊
    loadPPTGallery();
    document.getElementById('folder-selector-modal').style.display = 'flex';
}

// 加载PPT画廊
async function loadPPTGallery() {
    const galleryGrid = document.getElementById('ppt-gallery-grid');
    if (!galleryGrid) return;
    
    // 清空现有内容
    galleryGrid.innerHTML = '';
    
    // 显示加载提示
    galleryGrid.innerHTML = '<div class="loading-message">正在扫描PPT项目...</div>';
    
    // 动态检测PPT项目
    const pptProjects = await discoverPPTProjects();
    
    // 清空加载提示
    galleryGrid.innerHTML = '';
    
    // 为每个项目创建卡片
    pptProjects.forEach(project => {
        const card = createPPTCard(project);
        galleryGrid.appendChild(card);
    });
    
    // 如果没有找到项目，显示提示
    if (pptProjects.length === 0) {
        // 检查是否有 ppt-list.js 配置文件
        if (typeof window.pptProjects === 'undefined') {
            galleryGrid.innerHTML = `
                <div class="error-message">
                    <h4>⚠️ 未找到 ppt-list.js 配置文件</h4>
                    <p>请在项目根目录创建 <code>ppt-list.js</code> 文件，并添加以下内容：</p>
                    <pre><code>window.pptProjects = {
    'default': {
        name: '默认演示',
        description: 'HTML PPT模板介绍',
        badge: '默认',
        badgeClass: 'default',
        files: ['01-cover.html', '02-features.html', '03-thanks.html']
    },
    'my-presentation': {
        name: '我的演示',
        description: '自定义演示文稿',
        badge: '自定义',
        badgeClass: 'custom',
        files: ['01-cover.html', '02-content.html', '03-thanks.html']
    }
};</code></pre>
                    <p>查看 README.md 了解如何使用 AI 编辑器创建 PPT 项目。</p>
                </div>
            `;
        } else {
            galleryGrid.innerHTML = `
                <div class="no-projects-message">
                    <h4>🔍 未发现PPT项目</h4>
                    <p>请检查 <code>ppt-list.js</code> 中配置的项目信息是否正确。</p>
                    <p>查看 README.md 了解如何使用 AI 编辑器创建 PPT 项目。</p>
                </div>
            `;
        }
    }
}

// 动态发现PPT项目
async function discoverPPTProjects() {
    const projects = [];
    
    // 检查是否有 ppt-list.js 配置文件
    if (typeof window.pptProjects === 'undefined') {
        console.warn('未找到 ppt-list.js 配置文件');
        return [];
    }
    
    // 从 ppt-list.js 配置文件读取项目列表
    for (const [projectPath, projectConfig] of Object.entries(window.pptProjects)) {
        try {
            const fullPath = `ppt/${projectPath}`;
            
            // 使用配置文件中的第一个文件作为预览
            const previewFile = projectConfig.files && projectConfig.files.length > 0 
                ? `${fullPath}/${projectConfig.files[0]}`
                : `${fullPath}/01-cover.html`;
            
            projects.push({
                path: fullPath,
                name: projectConfig.name || projectPath.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: projectConfig.description || '自定义PPT项目',
                badge: projectConfig.badge || '自定义',
                badgeClass: projectConfig.badgeClass || 'custom',
                files: projectConfig.files || ['01-cover.html', '02-content.html', '03-thanks.html'],
                previewFile: previewFile
            });
            
            console.log(`加载项目: ${projectConfig.name} - 预览文件: ${previewFile}`);
        } catch (error) {
            console.log(`项目 ${projectPath} 加载失败:`, error);
        }
    }
    
    console.log(`总共加载 ${projects.length} 个项目`);
    return projects;
}

// 查找项目文件夹中的第一个有效HTML文件作为预览
async function findFirstValidFile(projectPath, expectedFiles) {
    // 由于浏览器CORS限制，直接返回预期的第一个文件
    // 这些文件实际存在，但fetch检测在本地文件系统中受限
    console.log(`为项目 ${projectPath} 返回预期的第一个文件`);
    
    if (expectedFiles && expectedFiles.length > 0) {
        const firstFile = `${projectPath}/${expectedFiles[0]}`;
        console.log(`返回预期文件: ${firstFile}`);
        return firstFile;
    }
    
    // 备用方案：使用常见的文件名
    const fallbackFiles = [
        '01-cover.html',
        '01-welcome.html', 
        '01-intro.html',
        'index.html'
    ];
    
    const firstFallback = `${projectPath}/${fallbackFiles[0]}`;
    console.log(`返回备用文件: ${firstFallback}`);
    return firstFallback;
}

// 创建PPT卡片
function createPPTCard(project) {
    const card = document.createElement('div');
    card.className = 'ppt-card';
    card.onclick = () => selectFolder(project.path);
    
    card.innerHTML = `
        <div class="ppt-preview">
            <iframe src="${project.previewFile}" class="preview-frame"></iframe>
        </div>
        <div class="ppt-info">
            <h4>${project.name}</h4>
            <p>${project.description}</p>
            <span class="ppt-badge ${project.badgeClass}">${project.badge}</span>
        </div>
    `;
    
    return card;
}

function closeFolderSelector() {
    document.getElementById('folder-selector-modal').style.display = 'none';
}

async function selectFolder(folderPath) {
    try {
        // 显示加载提示
        showToast('正在加载项目文件...', 1000);
        
        // 动态获取文件列表
        const files = await discoverProjectFiles(folderPath);
        
        if (files.length === 0) {
            showToast('该文件夹中没有找到HTML文件', 3000);
            return;
        }
        
        // 更新配置
        PPTConfig.slideFiles.basePath = folderPath + '/';
        PPTConfig.slideFiles.files = files;
        
        // 重新加载幻灯片
        loadSlideContent();
        
        // 保存用户选择
        localStorage.setItem('ppt-folder-path', folderPath);
        
        // 关闭弹窗
        closeFolderSelector();
        
        // 成功提示
        showToast(`已切换到: ${folderPath.replace('ppt/', '').replace('examples/', '')}`, 2000);
        
    } catch (error) {
        console.error('切换文件夹失败:', error);
        showToast('切换文件夹失败，请检查路径是否正确', 3000);
    }
}

// 动态发现项目文件
async function discoverProjectFiles(projectPath) {
    // 检查是否有 ppt-list.js 配置文件
    if (typeof window.pptProjects === 'undefined') {
        console.warn('未找到 ppt-list.js 配置文件，使用默认文件列表');
        return ['01-cover.html', '02-content.html', '03-thanks.html'];
    }
    
    // 从路径中提取项目键（去掉 'ppt/' 前缀）
    const projectKey = projectPath.replace(/^ppt\//, '');
    
    // 从配置文件中获取文件列表
    if (window.pptProjects[projectKey] && window.pptProjects[projectKey].files) {
        console.log(`从配置文件获取文件列表: ${projectPath}`, window.pptProjects[projectKey].files);
        return window.pptProjects[projectKey].files;
    }
    
    // 对于未知项目，返回默认文件列表
    const defaultFiles = [
        '01-cover.html',
        '02-content.html', 
        '03-thanks.html'
    ];
    
    console.log(`使用默认文件列表: ${projectPath}`, defaultFiles);
    return defaultFiles;
}

function selectCustomFolder() {
    const customPath = document.getElementById('custom-folder-path').value.trim();
    if (!customPath) {
        alert('请输入文件夹路径');
        return;
    }
    
    selectFolder(customPath);
    document.getElementById('custom-folder-path').value = '';
}

// 页面加载时恢复用户选择的文件夹
async function restoreUserFolder() {
    const savedFolder = localStorage.getItem('ppt-folder-path');
    if (savedFolder && savedFolder !== 'ppt/default') {
        try {
            // 动态获取文件列表
            const files = await discoverProjectFiles(savedFolder);
            
            if (files.length > 0) {
                // 更新配置
                PPTConfig.slideFiles.basePath = savedFolder + '/';
                PPTConfig.slideFiles.files = files;
                return; // 成功加载保存的文件夹，直接返回
            } else {
                console.log(`已保存的文件夹 ${savedFolder} 中没有找到HTML文件，回退到默认文件夹`);
                localStorage.removeItem('ppt-folder-path');
            }
        } catch (error) {
            console.log(`无法访问已保存的文件夹 ${savedFolder}，回退到默认文件夹:`, error);
            localStorage.removeItem('ppt-folder-path');
        }
    }
    
    // 如果没有保存的文件夹或加载失败，使用第一个可用项目
    try {
        // 从 ppt-list.js 中获取第一个项目
        if (typeof window.pptProjects !== 'undefined') {
            const firstProjectKey = Object.keys(window.pptProjects)[0];
            if (firstProjectKey) {
                const firstProjectPath = `ppt/${firstProjectKey}`;
                const firstProjectFiles = await discoverProjectFiles(firstProjectPath);
                if (firstProjectFiles.length > 0) {
                    PPTConfig.slideFiles.basePath = firstProjectPath + '/';
                    PPTConfig.slideFiles.files = firstProjectFiles;
                    console.log(`已加载第一个项目: ${firstProjectKey}`, firstProjectFiles);
                    return;
                }
            }
        }
        
        // 如果 ppt-list.js 不存在或为空，回退到默认项目
        const defaultFiles = await discoverProjectFiles('ppt/default');
        if (defaultFiles.length > 0) {
            PPTConfig.slideFiles.basePath = 'ppt/default/';
            PPTConfig.slideFiles.files = defaultFiles;
            console.log('已加载默认项目文件:', defaultFiles);
        }
    } catch (error) {
        console.error('加载项目失败:', error);
    }
}

// 导出到全局作用域
window.PPTState = PPTState;
window.initializePPT = initializePPT;
window.goToSlide = goToSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.firstSlide = firstSlide;
window.lastSlide = lastSlide;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.showPresentationTimer = showPresentationTimer;
window.resetSlideOrder = resetSlideOrder;
window.toggleSidebarSection = toggleSidebarSection;
window.toggleFullscreen = toggleFullscreen;
window.showHelp = showHelp;
window.closeHelp = closeHelp;
window.startTutorial = startTutorial;
window.closeWelcome = closeWelcome;
window.openReadme = openReadme;
window.initializeZoomController = initializeZoomController;
window.showFolderSelector = showFolderSelector;
window.closeFolderSelector = closeFolderSelector;
window.selectFolder = selectFolder;
window.selectCustomFolder = selectCustomFolder;
window.loadPPTGallery = loadPPTGallery;
window.createPPTCard = createPPTCard;
window.showToast = showToast;

// 侧边栏区域展开/收缩功能
function toggleSidebarSection(sectionName) {
    const sectionContent = document.getElementById(sectionName + '-section');
    const sectionHeader = document.querySelector(`[onclick="toggleSidebarSection('${sectionName}')"]`);
    
    if (sectionContent && sectionHeader) {
        const isCollapsed = sectionContent.classList.contains('collapsed');
        
        if (isCollapsed) {
            sectionContent.classList.remove('collapsed');
            sectionContent.classList.add('expanded');
            sectionHeader.classList.remove('collapsed');
        } else {
            sectionContent.classList.add('collapsed');
            sectionContent.classList.remove('expanded');
            sectionHeader.classList.add('collapsed');
        }
    }
}

// 初始化侧边栏区域状态
function initializeSidebarSections() {
    const sections = ['functions'];
    sections.forEach(section => {
        const sectionContent = document.getElementById(section + '-section');
        if (sectionContent) {
            // 默认展开功能面板
            sectionContent.classList.add('expanded');
        }
    });
}