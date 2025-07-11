/**
 * 侧边栏缩略图管理器
 * 
 * 功能：
 * - 在侧边栏中显示幻灯片缩略图
 * - 支持拖拽排序
 * - 支持隐藏/显示幻灯片
 * - 本地存储设置
 */

class SidebarThumbnailManager {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.slideOrder = [];
        this.isDragging = false;
        this.dragStartIndex = null;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
    }

    // 加载设置
    loadSettings() {
        try {
            const savedOrder = localStorage.getItem('ppt-slide-order');
            
            if (savedOrder) {
                this.slideOrder = JSON.parse(savedOrder);
            }
        } catch (e) {
            console.warn('加载侧边栏设置失败:', e);
        }
    }

    // 保存设置
    saveSettings() {
        try {
            localStorage.setItem('ppt-slide-order', JSON.stringify(this.slideOrder));
        } catch (e) {
            console.warn('保存侧边栏设置失败:', e);
        }
    }

    // 绑定事件
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateSidebarNavigation();
        });
    }

    // 更新侧边栏导航
    updateSidebarNavigation() {
        if (!window.PPTState || !window.PPTState.slides) {
            setTimeout(() => this.updateSidebarNavigation(), 100);
            return;
        }

        this.slides = window.PPTState.slides;
        this.initializeSlideOrder();
        this.renderNavigation();
    }

    // 初始化幻灯片顺序
    initializeSlideOrder() {
        if (this.slideOrder.length === 0 || this.slideOrder.length !== this.slides.length) {
            this.slideOrder = this.slides.map((_, index) => index);
            this.saveSettings();
        }
    }

    // 渲染导航
    renderNavigation() {
        const navigation = document.getElementById('slide-navigation');
        if (!navigation) return;

        navigation.innerHTML = '';

        // 按照自定义顺序渲染
        this.slideOrder.forEach((originalIndex, displayIndex) => {
            const slide = this.slides[originalIndex];
            if (!slide) return;

            const navItem = this.createNavItem(slide, originalIndex, displayIndex);
            navigation.appendChild(navItem);
        });
        
        // 更新当前激活状态
        this.updateActiveSlide();
    }

    // 创建导航项
    createNavItem(slide, originalIndex, displayIndex) {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.dataset.originalIndex = originalIndex;
        navItem.dataset.displayIndex = displayIndex;
        navItem.draggable = true;

        const slideUrl = slide.filepath || (window.PPTConfig.slideFiles.basePath + slide.filename);
        
        // 从文件名提取标题
        const slideTitle = this.extractTitleFromFilename(slide.filename);
        
        navItem.innerHTML = `
            <div class="nav-item-content">
                <div class="nav-item-thumbnail">
                    <iframe src="${slideUrl}" frameborder="0"></iframe>
                </div>
                <div class="nav-item-info">
                    <div class="nav-item-title">${slideTitle}</div>
                    <div class="nav-item-number">幻灯片 ${displayIndex + 1}</div>
                </div>
            </div>
            <div class="drag-indicator top"></div>
            <div class="drag-indicator bottom"></div>
        `;

        // 绑定事件
        this.bindNavItemEvents(navItem, originalIndex);

        return navItem;
    }

    // 从文件名提取标题
    extractTitleFromFilename(filename) {
        // 移除文件扩展名
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
        
        // 根据常见的文件名模式提取标题
        const patterns = [
            // 01-welcome -> 欢迎
            { pattern: /^\d+-welcome$/, title: '欢迎' },
            // 02-features -> 功能特性
            { pattern: /^\d+-features$/, title: '功能特性' },
            // 03-how-to-use -> 使用指南
            { pattern: /^\d+-how-to-use$/, title: '使用指南' },
            // 其他数字+名称的模式
            { pattern: /^\d+-(.+)$/, title: (match) => this.formatTitle(match[1]) }
        ];
        
        for (const { pattern, title } of patterns) {
            const match = nameWithoutExt.match(pattern);
            if (match) {
                return typeof title === 'function' ? title(match) : title;
            }
        }
        
        // 如果没有匹配到特定模式，使用文件名（去掉数字前缀）
        return this.formatTitle(nameWithoutExt.replace(/^\d+-/, ''));
    }

    // 格式化标题
    formatTitle(title) {
        const titleMap = {
            'welcome': '欢迎',
            'features': '功能特性',
            'how-to-use': '使用指南',
            'about': '关于',
            'contact': '联系我们',
            'demo': '演示',
            'intro': '介绍',
            'overview': '概览',
            'conclusion': '总结'
        };
        
        return titleMap[title] || title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // 绑定导航项事件
    bindNavItemEvents(navItem, originalIndex) {
        // 点击跳转
        navItem.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item-action')) {
                this.goToSlide(originalIndex);
            }
        });

        // 拖拽事件
        navItem.addEventListener('dragstart', (e) => this.handleDragStart(e, originalIndex));
        navItem.addEventListener('dragover', (e) => this.handleDragOver(e));
        navItem.addEventListener('drop', (e) => this.handleDrop(e));
        navItem.addEventListener('dragend', () => this.handleDragEnd());
        navItem.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        navItem.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    }

    // 拖拽开始
    handleDragStart(e, originalIndex) {
        this.isDragging = true;
        this.dragStartIndex = originalIndex;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    // 拖拽经过
    handleDragOver(e) {
        if (this.isDragging) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }

    // 拖拽进入
    handleDragEnter(e) {
        if (this.isDragging && e.target.closest('.nav-item')) {
            const rect = e.target.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const indicator = e.currentTarget.querySelector(
                e.clientY < midY ? '.drag-indicator.top' : '.drag-indicator.bottom'
            );
            
            // 清除其他指示器
            document.querySelectorAll('.drag-indicator.visible').forEach(el => {
                el.classList.remove('visible');
            });
            
            if (indicator) {
                indicator.classList.add('visible');
            }
        }
    }

    // 拖拽离开
    handleDragLeave(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.querySelectorAll('.drag-indicator').forEach(el => {
                el.classList.remove('visible');
            });
        }
    }

    // 放置
    handleDrop(e) {
        if (this.isDragging) {
            e.preventDefault();
            
            const targetNavItem = e.target.closest('.nav-item');
            if (!targetNavItem) return;

            const targetOriginalIndex = parseInt(targetNavItem.dataset.originalIndex);
            const rect = targetNavItem.getBoundingClientRect();
            const dropPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
            
            this.reorderSlides(this.dragStartIndex, targetOriginalIndex, dropPosition);
        }
    }

    // 拖拽结束
    handleDragEnd() {
        this.isDragging = false;
        this.dragStartIndex = null;
        
        document.querySelectorAll('.nav-item.dragging').forEach(el => {
            el.classList.remove('dragging');
        });
        
        document.querySelectorAll('.drag-indicator.visible').forEach(el => {
            el.classList.remove('visible');
        });
    }

    // 重新排序幻灯片
    reorderSlides(fromOriginalIndex, toOriginalIndex, position) {
        const fromDisplayIndex = this.slideOrder.indexOf(fromOriginalIndex);
        const toDisplayIndex = this.slideOrder.indexOf(toOriginalIndex);
        
        if (fromDisplayIndex === -1 || toDisplayIndex === -1 || fromDisplayIndex === toDisplayIndex) {
            return;
        }

        // 从数组中移除拖拽的项
        const [draggedItem] = this.slideOrder.splice(fromDisplayIndex, 1);
        
        // 重新计算插入位置
        let insertIndex = this.slideOrder.indexOf(toOriginalIndex);
        if (position === 'after') {
            insertIndex += 1;
        }
        
        // 插入到新位置
        this.slideOrder.splice(insertIndex, 0, draggedItem);
        
        // 保存设置并重新渲染
        this.saveSettings();
        this.renderNavigation();
        
        // 确保全局状态同步
        this.syncGlobalState();
        
        // 显示提示
        this.showNotification('已重新排序幻灯片');
    }

    // 跳转到幻灯片
    goToSlide(originalIndex) {
        if (window.loadSlideByIndex) {
            window.loadSlideByIndex(originalIndex);
        }
        this.currentSlide = originalIndex;
        this.updateActiveSlide();
    }

    // 更新当前激活的幻灯片
    updateActiveSlide() {
        const currentIndex = window.PPTState ? window.PPTState.currentSlide : this.currentSlide;
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-original-index="${currentIndex}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }



    // 重置幻灯片顺序
    resetOrder() {
        if (confirm('确定要重置幻灯片顺序吗？这将恢复到默认顺序。')) {
            this.slideOrder = this.slides.map((_, index) => index);
            this.saveSettings();
            this.renderNavigation();
            this.syncGlobalState();
            this.showNotification('已重置幻灯片顺序');
        }
    }

    // 同步全局状态
    syncGlobalState() {
        // 确保全局PPTState能够正确获取当前的slide order
        if (window.PPTState) {
            // 通知main.js更新状态
            window.PPTState.customSlideOrder = this.slideOrder;
        }
        
        // 确保当前幻灯片在新顺序中的位置正确
        if (window.PPTState && window.PPTState.currentSlide !== undefined) {
            this.updateActiveSlide();
        }
    }



    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'sidebar-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            zIndex: '1000',
            transform: 'translateX(300px)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // 获取当前幻灯片列表（按显示顺序）
    getCurrentSlideOrder() {
        return this.slideOrder.map(originalIndex => this.slides[originalIndex]);
    }


}

// 全局实例
let sidebarThumbnails;

// 全局函数供HTML调用
function resetSlideOrder() {
    if (window.sidebarThumbnails) {
        window.sidebarThumbnails.resetOrder();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    window.sidebarThumbnails = new SidebarThumbnailManager();
    
    // 与主程序集成
    if (window.PPTState) {
        // 监听幻灯片变化
        const originalLoadSlideByIndex = window.loadSlideByIndex;
        if (originalLoadSlideByIndex) {
            window.loadSlideByIndex = function(index) {
                const result = originalLoadSlideByIndex.call(this, index);
                if (window.sidebarThumbnails) {
                    window.sidebarThumbnails.currentSlide = index;
                    window.sidebarThumbnails.updateActiveSlide();
                }
                return result;
            };
        }
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarThumbnailManager;
} 