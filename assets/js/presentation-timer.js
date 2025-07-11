/**
 * HTML PPT 模板 - 演示计时器模块
 * 
 * 提供演示计时功能，包括：
 * - 演示计时器
 * - 倒计时器
 * - 时间统计
 * - 演示数据记录
 */

class PresentationTimer {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.isRunning = false;
        this.slideStartTime = null;
        this.slideTimeRecords = [];
        this.timerInterval = null;
        this.countdownInterval = null;
        
        // 目标时间设置（分钟）
        this.targetDuration = 5;
        this.warningTime = 4; // 警告时间（分钟）
        this.criticalTime = 4.5; // 危险时间（分钟）
        
        this.init();
    }

    init() {
        this.createTimerUI();
        this.bindEvents();
        this.loadSettings();
    }

    createTimerUI() {
        // 创建计时器UI
        const timerPanel = document.createElement('div');
        timerPanel.id = 'presentation-timer';
        timerPanel.className = 'presentation-timer';
        timerPanel.innerHTML = `
            <div class="timer-header">
                <h3>
                    <i class="fas fa-clock"></i>
                    演示计时器
                </h3>
                <div class="timer-controls">
                    <button class="timer-btn" id="timer-settings" title="设置">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="timer-btn" id="timer-minimize" title="最小化">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="timer-btn" id="timer-close" title="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="timer-content">
                <div class="timer-display">
                    <div class="elapsed-time">
                        <div class="time-label">已用时间</div>
                        <div class="time-value" id="elapsed-time">00:00:00</div>
                    </div>
                    <div class="remaining-time">
                        <div class="time-label">剩余时间</div>
                        <div class="time-value" id="remaining-time">05:00:00</div>
                    </div>
                </div>
                
                <div class="timer-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="timer-progress"></div>
                    </div>
                    <div class="progress-text">
                        <span id="progress-percentage">0%</span>
                        <span id="target-time">目标: 5分钟</span>
                    </div>
                </div>
                
                <div class="timer-actions">
                    <button class="timer-action-btn start" id="timer-start">
                        <i class="fas fa-play"></i>
                        开始
                    </button>
                    <button class="timer-action-btn pause" id="timer-pause" disabled>
                        <i class="fas fa-pause"></i>
                        暂停
                    </button>
                    <button class="timer-action-btn stop" id="timer-stop" disabled>
                        <i class="fas fa-stop"></i>
                        停止
                    </button>
                    <button class="timer-action-btn reset" id="timer-reset">
                        <i class="fas fa-redo"></i>
                        重置
                    </button>
                </div>
                
                <div class="timer-stats">
                    <div class="stat-item">
                        <div class="stat-label">当前幻灯片</div>
                        <div class="stat-value" id="current-slide-time">00:00</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">平均用时</div>
                        <div class="stat-value" id="average-slide-time">00:00</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">总幻灯片</div>
                        <div class="stat-value" id="total-slides">0</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(timerPanel);
        
        // 创建设置面板
        this.createSettingsPanel();
        
        // 创建最小化状态
        this.createMinimizedTimer();
    }

    createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'timer-settings-panel';
        settingsPanel.className = 'timer-settings-panel';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <h4>计时器设置</h4>
                <button class="settings-close" id="settings-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="settings-content">
                <div class="setting-item">
                    <label>目标时长 (分钟):</label>
                    <input type="number" id="target-duration" min="1" max="240" value="5">
                </div>
                
                <div class="setting-item">
                    <label>警告时间 (分钟):</label>
                    <input type="number" id="warning-time" min="1" max="240" value="4">
                </div>
                
                <div class="setting-item">
                    <label>危险时间 (分钟):</label>
                    <input type="number" id="critical-time" min="1" max="240" value="4.5" step="0.5">
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="auto-start" checked>
                        自动开始计时
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="sound-alerts" checked>
                        声音提醒
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="show-progress" checked>
                        显示进度条
                    </label>
                </div>
            </div>
            
            <div class="settings-actions">
                <button class="settings-btn save" id="settings-save">保存设置</button>
                <button class="settings-btn cancel" id="settings-cancel">取消</button>
            </div>
        `;
        
        document.body.appendChild(settingsPanel);
    }

    createMinimizedTimer() {
        const minimizedTimer = document.createElement('div');
        minimizedTimer.id = 'minimized-timer';
        minimizedTimer.className = 'minimized-timer';
        minimizedTimer.innerHTML = `
            <div class="mini-timer-content">
                <div class="mini-time" id="mini-elapsed">00:00</div>
                <div class="mini-controls">
                    <button class="mini-btn" id="mini-pause">
                        <i class="fas fa-pause"></i>
                    </button>
                    <button class="mini-btn" id="mini-expand">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(minimizedTimer);
    }

    bindEvents() {
        // 计时器控制按钮
        document.getElementById('timer-start').addEventListener('click', () => this.start());
        document.getElementById('timer-pause').addEventListener('click', () => this.pause());
        document.getElementById('timer-stop').addEventListener('click', () => this.stop());
        document.getElementById('timer-reset').addEventListener('click', () => this.reset());
        
        // 面板控制
        document.getElementById('timer-settings').addEventListener('click', () => this.showSettings());
        document.getElementById('timer-minimize').addEventListener('click', () => this.minimize());
        document.getElementById('timer-close').addEventListener('click', () => this.close());
        
        // 设置面板
        document.getElementById('settings-close').addEventListener('click', () => this.hideSettings());
        document.getElementById('settings-save').addEventListener('click', () => this.saveSettings());
        document.getElementById('settings-cancel').addEventListener('click', () => this.hideSettings());
        
        // 最小化状态
        document.getElementById('mini-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('mini-expand').addEventListener('click', () => this.maximize());
        
        // 监听幻灯片变化
        document.addEventListener('slideChanged', (e) => {
            this.onSlideChange(e.detail.currentSlide);
        });
        
        // 监听演示开始/结束
        document.addEventListener('presentationStart', () => {
            if (this.autoStart) {
                this.start();
            }
        });
        
        document.addEventListener('presentationEnd', () => {
            this.stop();
        });
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.pausedTime;
            this.slideStartTime = Date.now();
            this.isRunning = true;
            this.isPaused = false;
            
            this.updateButtons();
            this.startTimer();
            
            // 触发事件
            this.dispatchEvent('timerStart');
        }
    }

    pause() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            this.pausedTime = Date.now() - this.startTime;
            
            this.updateButtons();
            this.stopTimer();
            
            this.dispatchEvent('timerPause');
        }
    }

    resume() {
        if (this.isPaused) {
            this.startTime = Date.now() - this.pausedTime;
            this.isPaused = false;
            
            this.updateButtons();
            this.startTimer();
            
            this.dispatchEvent('timerResume');
        }
    }

    stop() {
        if (this.isRunning) {
            this.endTime = Date.now();
            this.isRunning = false;
            this.isPaused = false;
            
            this.updateButtons();
            this.stopTimer();
            
            // 保存最后一张幻灯片的时间
            if (this.slideStartTime) {
                this.recordSlideTime();
            }
            
            this.dispatchEvent('timerStop');
            this.showSummary();
        }
    }

    reset() {
        this.startTime = null;
        this.endTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.isRunning = false;
        this.slideStartTime = null;
        this.slideTimeRecords = [];
        
        this.updateButtons();
        this.stopTimer();
        this.updateDisplay();
        
        this.dispatchEvent('timerReset');
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateDisplay();
            this.checkTimeAlerts();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateDisplay() {
        const elapsed = this.getElapsedTime();
        const remaining = this.getRemainingTime();
        const progress = this.getProgress();
        
        // 更新时间显示
        document.getElementById('elapsed-time').textContent = this.formatTime(elapsed);
        document.getElementById('remaining-time').textContent = this.formatTime(remaining);
        document.getElementById('mini-elapsed').textContent = this.formatTime(elapsed, true);
        
        // 更新进度条
        const progressFill = document.getElementById('timer-progress');
        const progressText = document.getElementById('progress-percentage');
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        // 更新颜色状态
        this.updateTimerColor(elapsed);
        
        // 更新统计信息
        this.updateStats();
    }

    updateTimerColor(elapsed) {
        const elapsedMinutes = elapsed / 60000;
        const timerElement = document.getElementById('elapsed-time');
        const progressElement = document.getElementById('timer-progress');
        
        timerElement.classList.remove('warning', 'critical');
        progressElement.classList.remove('warning', 'critical');
        
        if (elapsedMinutes >= this.criticalTime) {
            timerElement.classList.add('critical');
            progressElement.classList.add('critical');
        } else if (elapsedMinutes >= this.warningTime) {
            timerElement.classList.add('warning');
            progressElement.classList.add('warning');
        }
    }

    updateStats() {
        const currentSlideTime = this.getCurrentSlideTime();
        const averageTime = this.getAverageSlideTime();
        const totalSlides = PPTState ? PPTState.totalSlides : 0;
        
        document.getElementById('current-slide-time').textContent = this.formatTime(currentSlideTime, true);
        document.getElementById('average-slide-time').textContent = this.formatTime(averageTime, true);
        document.getElementById('total-slides').textContent = totalSlides;
    }

    updateButtons() {
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        const stopBtn = document.getElementById('timer-stop');
        const miniPauseBtn = document.getElementById('mini-pause');
        
        if (this.isRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            if (this.isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
                miniPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
                miniPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
            miniPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    onSlideChange(slideIndex) {
        if (this.isRunning && !this.isPaused) {
            // 记录上一张幻灯片的时间
            if (this.slideStartTime) {
                this.recordSlideTime();
            }
            
            // 开始新幻灯片计时
            this.slideStartTime = Date.now();
        }
    }

    recordSlideTime() {
        if (this.slideStartTime) {
            const slideTime = Date.now() - this.slideStartTime;
            this.slideTimeRecords.push(slideTime);
        }
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        
        if (this.isPaused) {
            return this.pausedTime;
        } else if (this.isRunning) {
            return Date.now() - this.startTime;
        } else if (this.endTime) {
            return this.endTime - this.startTime;
        }
        
        return 0;
    }

    getRemainingTime() {
        const elapsed = this.getElapsedTime();
        const target = this.targetDuration * 60000;
        return Math.max(0, target - elapsed);
    }

    getProgress() {
        const elapsed = this.getElapsedTime();
        const target = this.targetDuration * 60000;
        return Math.min(100, (elapsed / target) * 100);
    }

    getCurrentSlideTime() {
        if (!this.slideStartTime || this.isPaused) return 0;
        return Date.now() - this.slideStartTime;
    }

    getAverageSlideTime() {
        if (this.slideTimeRecords.length === 0) return 0;
        const total = this.slideTimeRecords.reduce((sum, time) => sum + time, 0);
        return total / this.slideTimeRecords.length;
    }

    checkTimeAlerts() {
        const elapsed = this.getElapsedTime();
        const elapsedMinutes = elapsed / 60000;
        
        // 时间警告
        if (elapsedMinutes >= this.warningTime && !this.warningShown) {
            this.showAlert('warning', `⚠️ 时间警告：已用时 ${Math.round(elapsedMinutes)} 分钟`);
            this.warningShown = true;
        }
        
        if (elapsedMinutes >= this.criticalTime && !this.criticalShown) {
            this.showAlert('critical', `🚨 时间紧急：已用时 ${Math.round(elapsedMinutes)} 分钟`);
            this.criticalShown = true;
        }
        
        if (elapsedMinutes >= this.targetDuration && !this.overtimeShown) {
            this.showAlert('overtime', `⏰ 时间到：已超时 ${Math.round(elapsedMinutes - this.targetDuration)} 分钟`);
            this.overtimeShown = true;
        }
    }

    showAlert(type, message) {
        // 创建警告通知
        const alert = document.createElement('div');
        alert.className = `timer-alert ${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-message">${message}</div>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 3000);
        
        // 声音提醒
        if (this.soundAlerts) {
            this.playAlert(type);
        }
    }

    playAlert(type) {
        // 简单的声音提醒（使用Web Audio API）
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies = {
            warning: 800,
            critical: 1000,
            overtime: 1200
        };
        
        oscillator.frequency.value = frequencies[type] || 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    formatTime(milliseconds, short = false) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (short) {
            return hours > 0 ? 
                `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` :
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    showSettings() {
        document.getElementById('timer-settings-panel').style.display = 'block';
    }

    hideSettings() {
        document.getElementById('timer-settings-panel').style.display = 'none';
    }

    saveSettings() {
        this.targetDuration = parseInt(document.getElementById('target-duration').value);
        this.warningTime = parseInt(document.getElementById('warning-time').value);
        this.criticalTime = parseInt(document.getElementById('critical-time').value);
        this.autoStart = document.getElementById('auto-start').checked;
        this.soundAlerts = document.getElementById('sound-alerts').checked;
        this.showProgress = document.getElementById('show-progress').checked;
        
        // 保存到localStorage
        localStorage.setItem('presentationTimerSettings', JSON.stringify({
            targetDuration: this.targetDuration,
            warningTime: this.warningTime,
            criticalTime: this.criticalTime,
            autoStart: this.autoStart,
            soundAlerts: this.soundAlerts,
            showProgress: this.showProgress
        }));
        
        // 更新UI
        document.getElementById('target-time').textContent = `目标: ${this.targetDuration}分钟`;
        document.getElementById('remaining-time').textContent = this.formatTime(this.targetDuration * 60000);
        
        this.hideSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('presentationTimerSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.targetDuration = settings.targetDuration || 30;
            this.warningTime = settings.warningTime || 25;
            this.criticalTime = settings.criticalTime || 28;
            this.autoStart = settings.autoStart !== false;
            this.soundAlerts = settings.soundAlerts !== false;
            this.showProgress = settings.showProgress !== false;
            
            // 更新UI
            document.getElementById('target-duration').value = this.targetDuration;
            document.getElementById('warning-time').value = this.warningTime;
            document.getElementById('critical-time').value = this.criticalTime;
            document.getElementById('auto-start').checked = this.autoStart;
            document.getElementById('sound-alerts').checked = this.soundAlerts;
            document.getElementById('show-progress').checked = this.showProgress;
        }
    }

    minimize() {
        document.getElementById('presentation-timer').style.display = 'none';
        document.getElementById('minimized-timer').style.display = 'block';
    }

    maximize() {
        document.getElementById('presentation-timer').style.display = 'block';
        document.getElementById('minimized-timer').style.display = 'none';
    }

    close() {
        document.getElementById('presentation-timer').style.display = 'none';
        document.getElementById('minimized-timer').style.display = 'none';
        this.stop();
    }

    show() {
        document.getElementById('presentation-timer').style.display = 'block';
        document.getElementById('minimized-timer').style.display = 'none';
    }

    showSummary() {
        const totalTime = this.getElapsedTime();
        const slideCount = this.slideTimeRecords.length;
        const avgTime = this.getAverageSlideTime();
        
        const summary = document.createElement('div');
        summary.className = 'timer-summary';
        summary.innerHTML = `
            <div class="summary-content">
                <h3>演示总结</h3>
                <div class="summary-stats">
                    <div class="summary-item">
                        <span class="summary-label">总时长:</span>
                        <span class="summary-value">${this.formatTime(totalTime)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">幻灯片数:</span>
                        <span class="summary-value">${slideCount}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">平均用时:</span>
                        <span class="summary-value">${this.formatTime(avgTime, true)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">目标时长:</span>
                        <span class="summary-value">${this.targetDuration}分钟</span>
                    </div>
                </div>
                <div class="summary-actions">
                    <button class="summary-btn" onclick="this.closest('.timer-summary').remove()">
                        关闭
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(summary);
    }

    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { timer: this, ...data }
        });
        document.dispatchEvent(event);
    }
}

// 计时器样式
const timerStyles = `
    /* 演示计时器样式 */
    .presentation-timer {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: none;
    }

    .timer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .timer-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-primary);
    }

    .timer-controls {
        display: flex;
        gap: 0.5rem;
    }

    .timer-btn {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .timer-btn:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .timer-content {
        padding: 1rem;
    }

    .timer-display {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .time-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }

    .time-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
        font-family: 'Monaco', 'Consolas', monospace;
    }

    .time-value.warning {
        color: var(--warning-color);
    }

    .time-value.critical {
        color: var(--error-color);
    }

    .timer-progress {
        margin-bottom: 1rem;
    }

    .progress-bar {
        height: 8px;
        background: var(--border-color);
        border-radius: var(--radius-sm);
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: var(--success-color);
        transition: width 0.3s ease;
    }

    .progress-fill.warning {
        background: var(--warning-color);
    }

    .progress-fill.critical {
        background: var(--error-color);
    }

    .progress-text {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .timer-actions {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .timer-action-btn {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.8rem;
    }

    .timer-action-btn:hover:not(:disabled) {
        background: var(--hover-color);
    }

    .timer-action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .timer-action-btn.start {
        background: var(--success-color);
        color: white;
        border-color: var(--success-color);
    }

    .timer-action-btn.pause {
        background: var(--warning-color);
        color: white;
        border-color: var(--warning-color);
    }

    .timer-action-btn.stop {
        background: var(--error-color);
        color: white;
        border-color: var(--error-color);
    }

    .timer-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .stat-item {
        text-align: center;
    }

    .stat-label {
        font-size: 0.7rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
    }

    .stat-value {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    /* 最小化计时器 */
    .minimized-timer {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 0.5rem;
        box-shadow: var(--shadow-md);
        z-index: 1000;
        display: none;
    }

    .mini-timer-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .mini-time {
        font-family: 'Monaco', 'Consolas', monospace;
        font-weight: 600;
        color: var(--text-primary);
    }

    .mini-controls {
        display: flex;
        gap: 0.25rem;
    }

    .mini-btn {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .mini-btn:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    /* 设置面板 */
    .timer-settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        display: none;
    }

    .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .settings-header h4 {
        margin: 0;
        color: var(--text-primary);
    }

    .settings-close {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .settings-close:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .settings-content {
        padding: 1rem;
    }

    .setting-item {
        margin-bottom: 1rem;
    }

    .setting-item label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .setting-item input[type="number"] {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-color);
        color: var(--text-primary);
    }

    .setting-item input[type="checkbox"] {
        margin-right: 0.5rem;
    }

    .settings-actions {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .settings-btn {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .settings-btn.save {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .settings-btn:hover {
        background: var(--hover-color);
    }

    .settings-btn.save:hover {
        background: var(--primary-color);
        opacity: 0.9;
    }

    /* 警告提示 */
    .timer-alert {
        position: fixed;
        top: 80px;
        right: 20px;
        max-width: 320px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    }

    .timer-alert.warning {
        border-color: var(--warning-color);
        background: var(--warning-bg);
    }

    .timer-alert.critical {
        border-color: var(--error-color);
        background: var(--error-bg);
    }

    .timer-alert.overtime {
        border-color: var(--error-color);
        background: var(--error-bg);
        animation: blink 1s infinite;
    }

    .alert-content {
        display: flex;
        align-items: center;
        padding: 1rem;
    }

    .alert-message {
        flex: 1;
        color: var(--text-primary);
        font-weight: 500;
    }

    .alert-close {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .alert-close:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    /* 总结面板 */
    .timer-summary {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
    }

    .summary-content {
        padding: 1.5rem;
    }

    .summary-content h3 {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        text-align: center;
    }

    .summary-stats {
        margin-bottom: 1rem;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .summary-item:last-child {
        border-bottom: none;
    }

    .summary-label {
        color: var(--text-secondary);
    }

    .summary-value {
        color: var(--text-primary);
        font-weight: 600;
    }

    .summary-actions {
        text-align: center;
    }

    .summary-btn {
        padding: 0.5rem 2rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .summary-btn:hover {
        opacity: 0.9;
    }

    /* 动画效果 */
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes blink {
        0%, 50% {
            opacity: 1;
        }
        51%, 100% {
            opacity: 0.5;
        }
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
        .presentation-timer {
            width: 280px;
            top: 10px;
            right: 10px;
        }
        
        .timer-settings-panel {
            width: 300px;
        }
        
        .timer-summary {
            width: 300px;
        }
    }
`;

// 添加样式到页面
function addTimerStyles() {
    if (!document.getElementById('timer-styles')) {
        const style = document.createElement('style');
        style.id = 'timer-styles';
        style.textContent = timerStyles;
        document.head.appendChild(style);
    }
}

// 初始化计时器
function initializePresentationTimer() {
    addTimerStyles();
    const timer = new PresentationTimer();
    window.presentationTimer = timer;
    return timer;
}

// 显示/隐藏计时器的全局函数
function showPresentationTimer() {
    if (window.presentationTimer) {
        window.presentationTimer.show();
    } else {
        initializePresentationTimer();
        window.presentationTimer.show();
    }
}

// 自动初始化（可选）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 不自动初始化，等待用户调用
    });
} else {
    // 不自动初始化，等待用户调用
}

// 导出到全局
window.PresentationTimer = PresentationTimer;
window.initializePresentationTimer = initializePresentationTimer;
window.showPresentationTimer = showPresentationTimer; 