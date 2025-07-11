/**
 * HTML PPT 模板 - 键盘控制模块
 * 
 * 实现完整的键盘导航和快捷键功能
 * 参考 PowerPoint 和 Keynote 的键盘快捷键设计
 */

// 键盘事件管理器
class KeyboardController {
    constructor() {
        this.isEnabled = true;
        this.shortcuts = PPTConfig.keyboard;
        this.init();
    }

    init() {
        this.bindKeyboardEvents();
        this.setupHelpTooltips();
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e), true);
        document.addEventListener('keyup', (e) => this.handleKeyUp(e), true);
        
        // 确保焦点在主文档上，防止iframe捕获键盘事件
        document.addEventListener('click', () => {
            document.body.focus();
        });
        
        // 初始设置焦点
        document.body.tabIndex = -1;
        document.body.focus();
    }

    handleKeyDown(event) {
        // 如果正在输入或快捷键被禁用，则不处理
        if (!this.isEnabled || this.isTyping(event.target)) {
            return;
        }

        const key = event.code;
        const keyName = event.key;
        
        // 阻止默认行为的键
        const preventDefaults = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Space', 'Home', 'End', 'PageUp', 'PageDown',
            'F11', 'KeyH', 'KeyS', 'KeyT', 'KeyB', 'Period'
        ];

        if (preventDefaults.includes(key)) {
            event.preventDefault();
        }

        // 处理快捷键
        this.processShortcut(key, keyName, event);
    }

    handleKeyUp(event) {
        // 可以在这里处理按键释放事件
    }

    processShortcut(key, keyName, event) {
        // 上一张幻灯片
        if (this.shortcuts.prev.includes(key)) {
            prevSlide();
            this.showKeyboardFeedback('上一张');
            return;
        }

        // 下一张幻灯片
        if (this.shortcuts.next.includes(key)) {
            nextSlide();
            this.showKeyboardFeedback('下一张');
            return;
        }

        // 首页
        if (this.shortcuts.home.includes(key)) {
            firstSlide();
            this.showKeyboardFeedback('首页');
            return;
        }

        // 末页
        if (this.shortcuts.end.includes(key)) {
            lastSlide();
            this.showKeyboardFeedback('末页');
            return;
        }

        // 全屏切换
        if (this.shortcuts.fullscreen.includes(key)) {
            toggleFullscreen();
            this.showKeyboardFeedback(PPTState.isFullscreen ? '退出全屏' : '全屏');
            return;
        }

        // 退出全屏
        if (this.shortcuts.exitFullscreen.includes(key)) {
            if (PPTState.isFullscreen) {
                exitFullscreen();
                this.showKeyboardFeedback('退出全屏');
            }
            return;
        }

        // 帮助
        if (this.shortcuts.help.includes(key)) {
            showHelp();
            this.showKeyboardFeedback('帮助');
            return;
        }



        // 功能面板 - 不再支持主题切换
        // 主题切换功能已移除

        // 黑屏/白屏
        if (this.shortcuts.blackout.includes(key)) {
            this.toggleBlackout();
            this.showKeyboardFeedback('黑屏');
            return;
        }

        // 数字键直接跳转
        if (event.code.startsWith('Digit')) {
            const slideNumber = parseInt(keyName) - 1;
            if (slideNumber >= 0 && slideNumber < PPTState.totalSlides) {
                goToSlide(slideNumber);
                this.showKeyboardFeedback(`跳转到第 ${slideNumber + 1} 张`);
            }
            return;
        }

        // Ctrl/Cmd + 组合键
        if (event.ctrlKey || event.metaKey) {
            this.handleCtrlShortcuts(key, event);
            return;
        }
        
        // 功能面板快捷键已移除，功能已整合到侧边栏

        // Alt + 组合键
        if (event.altKey) {
            this.handleAltShortcuts(key, event);
            return;
        }

        // Shift + 组合键
        if (event.shiftKey) {
            this.handleShiftShortcuts(key, event);
            return;
        }
    }

    handleCtrlShortcuts(key, event) {
        switch (key) {


            case 'KeyP':
                event.preventDefault();
                exportToPDF();
                this.showKeyboardFeedback('打印');
                break;



        }
    }

    handleAltShortcuts(key, event) {
        switch (key) {
            case 'KeyT':
                event.preventDefault();
                this.showPresentationTimer();
                this.showKeyboardFeedback('演示计时器');
                break;
            case 'KeyO':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换侧边栏');
                break;
            case 'KeyL':
                event.preventDefault();
                this.showLayoutTemplates();
                this.showKeyboardFeedback('布局模板');
                break;
            case 'KeyM':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换菜单');
                break;
            case 'Tab':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换侧边栏');
                break;
            case 'KeyU':
                event.preventDefault();
                toggleSidebar();
                this.showKeyboardFeedback('切换侧边栏');
                break;
            case 'KeyI':
                event.preventDefault();
                if (typeof showPresentationTimer === 'function') {
                    showPresentationTimer();
                    this.showKeyboardFeedback('演示计时器');
                }
                break;
        }
    }

    handleShiftShortcuts(key, event) {
        switch (key) {
            case 'F11':
                event.preventDefault();
                this.togglePresentationMode();
                this.showKeyboardFeedback('演示模式');
                break;
        }
    }

    // 检查是否正在输入
    isTyping(target) {
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTypes.includes(target.tagName) || 
               target.contentEditable === 'true' ||
               target.isContentEditable;
    }

    // 显示键盘操作反馈
    showKeyboardFeedback(message) {
        // 创建或更新反馈提示
        let feedback = document.getElementById('keyboard-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'keyboard-feedback';
            feedback.className = 'keyboard-feedback';
            document.body.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.classList.add('show');

        // 自动隐藏
        clearTimeout(this.feedbackTimeout);
        this.feedbackTimeout = setTimeout(() => {
            feedback.classList.remove('show');
        }, 1500);
    }

    // 演讲者模式切换
    // 演讲者模式功能暂时移除，因为在Web环境中实现复杂
    // 用户可以通过全屏模式(F11)获得类似的演示体验
    toggleSpeakerMode() {
        this.showKeyboardFeedback('演讲者模式暂不支持，建议使用全屏模式 (F11)');
        console.warn('演讲者模式在Web环境中暂不支持，建议使用全屏模式 (F11) 获得类似体验');
    }

    enterSpeakerMode() {
        // 功能暂时移除
        this.toggleSpeakerMode();
    }

    exitSpeakerMode() {
        // 功能暂时移除
        this.toggleSpeakerMode();
    }

    showSpeakerNotes() {
        // 功能暂时移除
        this.toggleSpeakerMode();
    }

    hideSpeakerNotes() {
        // 功能暂时移除
        this.toggleSpeakerMode();
    }



    // 黑屏/白屏功能
    toggleBlackout() {
        PPTState.isBlackout = !PPTState.isBlackout;
        
        let blackoutOverlay = document.getElementById('blackout-overlay');
        if (!blackoutOverlay) {
            blackoutOverlay = document.createElement('div');
            blackoutOverlay.id = 'blackout-overlay';
            blackoutOverlay.className = 'blackout-overlay';
            blackoutOverlay.innerHTML = `
                <div class="blackout-message">
                    <p>按 B 键或 . 键恢复演示</p>
                </div>
            `;
            document.body.appendChild(blackoutOverlay);
        }

        if (PPTState.isBlackout) {
            blackoutOverlay.style.display = 'flex';
        } else {
            blackoutOverlay.style.display = 'none';
        }
    }

    // 搜索功能已移除

    // 文件操作功能已移除（直接编辑HTML文件更简单）

    // 撤销重做功能已移除（不适用于直接编辑HTML文件的场景）

    // 切换演示模式
    togglePresentationMode() {
        if (PPTState.isPresenting) {
            this.exitSpeakerMode();
        } else {
            this.enterSpeakerMode();
        }
    }

    // 启用/禁用键盘控制
    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    // 添加自定义快捷键
    addShortcut(key, callback) {
        if (!this.customShortcuts) {
            this.customShortcuts = {};
        }
        this.customShortcuts[key] = callback;
    }

    // 移除自定义快捷键
    removeShortcut(key) {
        if (this.customShortcuts) {
            delete this.customShortcuts[key];
        }
    }

    // 设置帮助提示
    setupHelpTooltips() {
        // 可以在这里设置键盘快捷键的提示
        const controlButtons = document.querySelectorAll('.control-btn');
        controlButtons.forEach(btn => {
            const title = btn.getAttribute('title');
            if (title) {
                btn.setAttribute('data-tooltip', title);
            }
        });
    }

    // 获取当前快捷键映射
    getShortcuts() {
        return this.shortcuts;
    }

    // 更新快捷键映射
    updateShortcuts(newShortcuts) {
        this.shortcuts = { ...this.shortcuts, ...newShortcuts };
    }
    
    // 新增功能方法
    // 功能面板已整合到侧边栏，不再需要独立的功能面板
    
    showPresentationTimer() {
        if (window.showPresentationTimer) {
            window.showPresentationTimer();
        }
    }
    
    showSlideThumbnails() {
        if (window.showSlideThumbnails) {
            window.showSlideThumbnails();
        }
    }
    
    showLayoutTemplates() {
        if (window.showLayoutTemplates) {
            window.showLayoutTemplates();
        }
    }
}

// 添加键盘反馈样式
const keyboardFeedbackStyle = `
    .keyboard-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        pointer-events: none;
    }
    
    .keyboard-feedback.show {
        opacity: 1;
        transform: translateY(0);
    }
    

    
    .blackout-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .blackout-message {
        color: white;
        text-align: center;
        font-size: 18px;
        opacity: 0.7;
    }
    

    
    @media (max-width: 768px) {
        .keyboard-feedback {
            top: 10px;
            right: 10px;
            font-size: 12px;
            padding: 6px 12px;
        }
        

        

    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = keyboardFeedbackStyle;
document.head.appendChild(styleSheet);

// 创建键盘控制器实例
const keyboardController = new KeyboardController();

// 导出到全局作用域
window.keyboardController = keyboardController; 