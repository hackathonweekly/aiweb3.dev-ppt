/**
 * HTML PPT 模板 - 布局模板模块
 * 
 * 提供多种幻灯片布局模板，包括：
 * - 封面布局
 * - 内容布局
 * - 双列布局
 * - 图片布局
 * - 代码布局
 * - 对比布局
 */

class LayoutTemplates {
    constructor() {
        this.templates = {
            cover: {
                name: '封面布局',
                icon: 'fas fa-home',
                description: '适用于标题页和封面',
                preview: 'cover-preview.png'
            },
            content: {
                name: '内容布局',
                icon: 'fas fa-align-left',
                description: '标准内容页面布局',
                preview: 'content-preview.png'
            },
            'two-columns': {
                name: '双列布局',
                icon: 'fas fa-columns',
                description: '左右两列分布内容',
                preview: 'two-columns-preview.png'
            },
            'image-text': {
                name: '图文布局',
                icon: 'fas fa-image',
                description: '图片和文字组合',
                preview: 'image-text-preview.png'
            },
            'code-showcase': {
                name: '代码展示',
                icon: 'fas fa-code',
                description: '代码展示和说明',
                preview: 'code-showcase-preview.png'
            },
            'comparison': {
                name: '对比布局',
                icon: 'fas fa-balance-scale',
                description: '对比两个概念或产品',
                preview: 'comparison-preview.png'
            },
            'timeline': {
                name: '时间轴',
                icon: 'fas fa-clock',
                description: '展示时间线和进程',
                preview: 'timeline-preview.png'
            },
            'gallery': {
                name: '图片画廊',
                icon: 'fas fa-images',
                description: '多图片展示',
                preview: 'gallery-preview.png'
            },
            'quote': {
                name: '引言布局',
                icon: 'fas fa-quote-left',
                description: '突出显示引言',
                preview: 'quote-preview.png'
            },
            'contact': {
                name: '联系方式',
                icon: 'fas fa-address-card',
                description: '联系信息和社交媒体',
                preview: 'contact-preview.png'
            }
        };
        
        this.currentTemplate = 'content';
        this.isVisible = false;
        
        this.init();
    }

    init() {
        this.createTemplatePanel();
        this.bindEvents();
    }

    createTemplatePanel() {
        const panel = document.createElement('div');
        panel.id = 'layout-templates-panel';
        panel.className = 'layout-templates-panel';
        panel.innerHTML = `
            <div class="templates-header">
                <h3>
                    <i class="fas fa-th-large"></i>
                    布局模板
                </h3>
                <button class="template-close" id="template-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="templates-content">
                <div class="template-categories">
                    <button class="category-btn active" data-category="all">
                        <i class="fas fa-th"></i>
                        全部
                    </button>
                    <button class="category-btn" data-category="basic">
                        <i class="fas fa-star"></i>
                        基础
                    </button>
                    <button class="category-btn" data-category="advanced">
                        <i class="fas fa-cogs"></i>
                        高级
                    </button>
                    <button class="category-btn" data-category="custom">
                        <i class="fas fa-user"></i>
                        自定义
                    </button>
                </div>
                
                <div class="templates-grid" id="templates-grid">
                    <!-- 模板项目将在这里生成 -->
                </div>
            </div>
            
            <div class="templates-footer">
                <button class="template-btn" id="template-apply">
                    <i class="fas fa-check"></i>
                    应用模板
                </button>
                <button class="template-btn secondary" id="template-preview">
                    <i class="fas fa-eye"></i>
                    预览
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 生成模板项目
        this.generateTemplateItems();
    }

    generateTemplateItems() {
        const grid = document.getElementById('templates-grid');
        grid.innerHTML = '';
        
        Object.entries(this.templates).forEach(([key, template]) => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.dataset.template = key;
            templateItem.innerHTML = `
                <div class="template-preview">
                    <div class="template-demo" id="demo-${key}">
                        ${this.generateTemplateDemo(key)}
                    </div>
                    <div class="template-overlay">
                        <button class="template-action" data-action="apply">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="template-action" data-action="preview">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="template-info">
                    <div class="template-title">
                        <i class="${template.icon}"></i>
                        ${template.name}
                    </div>
                    <div class="template-description">
                        ${template.description}
                    </div>
                </div>
            `;
            
            // 绑定事件
            templateItem.addEventListener('click', () => this.selectTemplate(key));
            
            const actions = templateItem.querySelectorAll('.template-action');
            actions.forEach(action => {
                action.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const actionType = action.dataset.action;
                    if (actionType === 'apply') {
                        this.applyTemplate(key);
                    } else if (actionType === 'preview') {
                        this.previewTemplate(key);
                    }
                });
            });
            
            grid.appendChild(templateItem);
        });
    }

    generateTemplateDemo(templateKey) {
        const demos = {
            cover: `
                <div class="demo-cover">
                    <h1>标题</h1>
                    <p>副标题</p>
                </div>
            `,
            content: `
                <div class="demo-content">
                    <h2>内容标题</h2>
                    <p>正文内容...</p>
                    <ul>
                        <li>要点一</li>
                        <li>要点二</li>
                    </ul>
                </div>
            `,
            'two-columns': `
                <div class="demo-two-columns">
                    <div class="demo-column">
                        <h3>左栏</h3>
                        <p>内容...</p>
                    </div>
                    <div class="demo-column">
                        <h3>右栏</h3>
                        <p>内容...</p>
                    </div>
                </div>
            `,
            'image-text': `
                <div class="demo-image-text">
                    <div class="demo-image">📷</div>
                    <div class="demo-text">
                        <h3>标题</h3>
                        <p>描述...</p>
                    </div>
                </div>
            `,
            'code-showcase': `
                <div class="demo-code">
                    <h3>代码示例</h3>
                    <pre><code>function() {
  return "Hello";
}</code></pre>
                </div>
            `,
            'comparison': `
                <div class="demo-comparison">
                    <div class="demo-vs-left">
                        <h4>选项 A</h4>
                        <p>特点...</p>
                    </div>
                    <div class="demo-vs-center">VS</div>
                    <div class="demo-vs-right">
                        <h4>选项 B</h4>
                        <p>特点...</p>
                    </div>
                </div>
            `,
            'timeline': `
                <div class="demo-timeline">
                    <div class="demo-timeline-item">
                        <div class="demo-timeline-date">2023</div>
                        <div class="demo-timeline-content">事件</div>
                    </div>
                    <div class="demo-timeline-item">
                        <div class="demo-timeline-date">2024</div>
                        <div class="demo-timeline-content">事件</div>
                    </div>
                </div>
            `,
            'gallery': `
                <div class="demo-gallery">
                    <div class="demo-gallery-item">🖼️</div>
                    <div class="demo-gallery-item">🖼️</div>
                    <div class="demo-gallery-item">🖼️</div>
                    <div class="demo-gallery-item">🖼️</div>
                </div>
            `,
            'quote': `
                <div class="demo-quote">
                    <blockquote>
                        <p>"引言内容..."</p>
                        <cite>— 作者</cite>
                    </blockquote>
                </div>
            `,
            'contact': `
                <div class="demo-contact">
                    <h3>联系我们</h3>
                    <p>📧 email@example.com</p>
                    <p>📱 +1 234 567 8900</p>
                    <div class="demo-social">
                        <span>📘</span>
                        <span>🐦</span>
                        <span>📸</span>
                    </div>
                </div>
            `
        };
        
        return demos[templateKey] || '<div class="demo-placeholder">模板预览</div>';
    }

    bindEvents() {
        // 关闭按钮
        document.getElementById('template-close').addEventListener('click', () => this.hide());
        
        // 分类按钮
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterTemplates(category);
                
                // 更新活动状态
                categoryButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // 底部按钮
        document.getElementById('template-apply').addEventListener('click', () => this.applyCurrentTemplate());
        document.getElementById('template-preview').addEventListener('click', () => this.previewCurrentTemplate());
    }

    selectTemplate(templateKey) {
        // 移除之前的选择
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 选择新模板
        const templateItem = document.querySelector(`[data-template="${templateKey}"]`);
        templateItem.classList.add('selected');
        
        this.currentTemplate = templateKey;
    }

    applyTemplate(templateKey) {
        const template = this.templates[templateKey];
        if (!template) return;
        
        // 获取当前幻灯片
        const currentSlide = document.querySelector('.slide.active');
        if (!currentSlide) return;
        
        // 生成模板HTML
        const templateHTML = this.generateTemplateHTML(templateKey);
        
        // 应用模板
        currentSlide.innerHTML = templateHTML;
        
        // 触发事件
        this.dispatchEvent('templateApplied', {
            templateKey,
            template,
            slide: currentSlide
        });
        
        // 显示成功消息
        this.showMessage(`已应用 ${template.name} 模板`);
        
        // 关闭面板
        this.hide();
    }

    applyCurrentTemplate() {
        if (this.currentTemplate) {
            this.applyTemplate(this.currentTemplate);
        }
    }

    previewTemplate(templateKey) {
        const template = this.templates[templateKey];
        if (!template) return;
        
        // 创建预览窗口
        const previewWindow = document.createElement('div');
        previewWindow.className = 'template-preview-window';
        previewWindow.innerHTML = `
            <div class="preview-header">
                <h3>${template.name} 预览</h3>
                <button class="preview-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-content">
                <div class="preview-slide">
                    ${this.generateTemplateHTML(templateKey)}
                </div>
            </div>
            <div class="preview-actions">
                <button class="preview-btn" onclick="layoutTemplates.applyTemplate('${templateKey}')">
                    <i class="fas fa-check"></i>
                    应用此模板
                </button>
                <button class="preview-btn secondary" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                    取消
                </button>
            </div>
        `;
        
        document.body.appendChild(previewWindow);
    }

    previewCurrentTemplate() {
        if (this.currentTemplate) {
            this.previewTemplate(this.currentTemplate);
        }
    }

    generateTemplateHTML(templateKey) {
        const templates = {
            cover: `
                <div class="slide-content cover-layout">
                    <div class="cover-main">
                        <h1 class="cover-title">演示标题</h1>
                        <p class="cover-subtitle">副标题或描述</p>
                        <div class="cover-meta">
                            <span class="cover-author">演讲者姓名</span>
                            <span class="cover-date">${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `,
            content: `
                <div class="slide-content content-layout">
                    <h2 class="content-title">内容标题</h2>
                    <div class="content-body">
                        <p>这里是正文内容，可以包含段落、列表等元素。</p>
                        <ul>
                            <li>要点一：描述...</li>
                            <li>要点二：描述...</li>
                            <li>要点三：描述...</li>
                        </ul>
                    </div>
                </div>
            `,
            'two-columns': `
                <div class="slide-content two-columns-layout">
                    <h2 class="section-title">双列布局</h2>
                    <div class="columns-container">
                        <div class="column-left">
                            <h3>左栏标题</h3>
                            <p>左栏内容...</p>
                            <ul>
                                <li>要点一</li>
                                <li>要点二</li>
                            </ul>
                        </div>
                        <div class="column-right">
                            <h3>右栏标题</h3>
                            <p>右栏内容...</p>
                            <ul>
                                <li>要点一</li>
                                <li>要点二</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            'image-text': `
                <div class="slide-content image-text-layout">
                    <h2 class="section-title">图文布局</h2>
                    <div class="image-text-container">
                        <div class="image-section">
                            <img src="https://via.placeholder.com/400x300" alt="示例图片" class="layout-image">
                        </div>
                        <div class="text-section">
                            <h3>图片标题</h3>
                            <p>图片描述文字，可以详细说明图片内容或相关信息。</p>
                            <ul>
                                <li>特点一</li>
                                <li>特点二</li>
                                <li>特点三</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            'code-showcase': `
                <div class="slide-content code-showcase-layout">
                    <h2 class="section-title">代码展示</h2>
                    <div class="code-container">
                        <div class="code-description">
                            <h3>代码说明</h3>
                            <p>这是一个JavaScript函数示例，展示了基本的语法结构。</p>
                        </div>
                        <div class="code-block">
                            <pre><code class="language-javascript">
function greetUser(name) {
    if (name) {
        return \`Hello, \${name}!\`;
    } else {
        return 'Hello, World!';
    }
}

// 使用示例
const greeting = greetUser('Alice');
console.log(greeting); // 输出: Hello, Alice!
                            </code></pre>
                        </div>
                    </div>
                </div>
            `,
            'comparison': `
                <div class="slide-content comparison-layout">
                    <h2 class="section-title">对比分析</h2>
                    <div class="comparison-container">
                        <div class="comparison-item">
                            <h3>选项 A</h3>
                            <div class="comparison-content">
                                <h4>优点</h4>
                                <ul>
                                    <li>优点一</li>
                                    <li>优点二</li>
                                </ul>
                                <h4>缺点</h4>
                                <ul>
                                    <li>缺点一</li>
                                    <li>缺点二</li>
                                </ul>
                            </div>
                        </div>
                        <div class="comparison-divider">VS</div>
                        <div class="comparison-item">
                            <h3>选项 B</h3>
                            <div class="comparison-content">
                                <h4>优点</h4>
                                <ul>
                                    <li>优点一</li>
                                    <li>优点二</li>
                                </ul>
                                <h4>缺点</h4>
                                <ul>
                                    <li>缺点一</li>
                                    <li>缺点二</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'timeline': `
                <div class="slide-content timeline-layout">
                    <h2 class="section-title">时间轴</h2>
                    <div class="timeline-container">
                        <div class="timeline-item">
                            <div class="timeline-date">2021</div>
                            <div class="timeline-content">
                                <h3>项目启动</h3>
                                <p>项目正式启动，完成初期规划</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2022</div>
                            <div class="timeline-content">
                                <h3>开发阶段</h3>
                                <p>核心功能开发，测试和优化</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2023</div>
                            <div class="timeline-content">
                                <h3>正式发布</h3>
                                <p>产品正式发布，市场推广</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2024</div>
                            <div class="timeline-content">
                                <h3>持续优化</h3>
                                <p>功能完善，用户反馈优化</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'gallery': `
                <div class="slide-content gallery-layout">
                    <h2 class="section-title">图片画廊</h2>
                    <div class="gallery-container">
                        <div class="gallery-item">
                            <img src="https://via.placeholder.com/300x200" alt="图片1">
                            <div class="gallery-caption">图片标题1</div>
                        </div>
                        <div class="gallery-item">
                            <img src="https://via.placeholder.com/300x200" alt="图片2">
                            <div class="gallery-caption">图片标题2</div>
                        </div>
                        <div class="gallery-item">
                            <img src="https://via.placeholder.com/300x200" alt="图片3">
                            <div class="gallery-caption">图片标题3</div>
                        </div>
                        <div class="gallery-item">
                            <img src="https://via.placeholder.com/300x200" alt="图片4">
                            <div class="gallery-caption">图片标题4</div>
                        </div>
                    </div>
                </div>
            `,
            'quote': `
                <div class="slide-content quote-layout">
                    <div class="quote-container">
                        <blockquote class="main-quote">
                            <p>"成功不是终点，失败不是致命的：继续前进的勇气才是最重要的。"</p>
                            <cite>— 温斯顿·丘吉尔</cite>
                        </blockquote>
                        <div class="quote-context">
                            <p>这句话提醒我们，在面对挑战时要保持坚韧不拔的精神。</p>
                        </div>
                    </div>
                </div>
            `,
            'contact': `
                <div class="slide-content contact-layout">
                    <h2 class="section-title">联系我们</h2>
                    <div class="contact-container">
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <h4>邮箱</h4>
                                    <p>contact@example.com</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div>
                                    <h4>电话</h4>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>地址</h4>
                                    <p>123 Main St, City, State 12345</p>
                                </div>
                            </div>
                        </div>
                        <div class="social-links">
                            <h4>关注我们</h4>
                            <div class="social-icons">
                                <a href="#" class="social-link">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="social-link">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a href="#" class="social-link">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                <a href="#" class="social-link">
                                    <i class="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
        
        return templates[templateKey] || templates.content;
    }

    filterTemplates(category) {
        const items = document.querySelectorAll('.template-item');
        
        items.forEach(item => {
            const templateKey = item.dataset.template;
            let show = true;
            
            if (category !== 'all') {
                // 这里可以根据实际需求实现分类逻辑
                const basicTemplates = ['cover', 'content', 'two-columns'];
                const advancedTemplates = ['code-showcase', 'comparison', 'timeline', 'gallery'];
                
                if (category === 'basic') {
                    show = basicTemplates.includes(templateKey);
                } else if (category === 'advanced') {
                    show = advancedTemplates.includes(templateKey);
                } else if (category === 'custom') {
                    show = false; // 自定义模板暂时为空
                }
            }
            
            item.style.display = show ? 'block' : 'none';
        });
    }

    show() {
        document.getElementById('layout-templates-panel').style.display = 'block';
        this.isVisible = true;
    }

    hide() {
        document.getElementById('layout-templates-panel').style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'template-message';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { layoutTemplates: this, ...data }
        });
        document.dispatchEvent(event);
    }
}

// 布局模板样式
const layoutTemplateStyles = `
    /* 布局模板样式 */
    .layout-templates-panel {
        position: fixed;
        top: 5%;
        left: 5%;
        width: 90%;
        height: 90%;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: none;
        flex-direction: column;
    }

    .templates-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .templates-header h3 {
        margin: 0;
        font-size: 1.2rem;
        color: var(--text-primary);
    }

    .template-close {
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .template-close:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .templates-content {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }

    .template-categories {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .category-btn {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.5rem 1rem;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s ease;
    }

    .category-btn:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .category-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
    }

    .template-item {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--surface-color);
    }

    .template-item:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-md);
    }

    .template-item.selected {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px var(--primary-color-alpha);
    }

    .template-preview {
        position: relative;
        width: 100%;
        height: 160px;
        background: white;
        overflow: hidden;
    }

    .template-demo {
        width: 100%;
        height: 100%;
        padding: 1rem;
        font-size: 0.7rem;
        transform: scale(0.8);
        transform-origin: top left;
    }

    .template-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .template-item:hover .template-overlay {
        opacity: 1;
    }

    .template-action {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-primary);
        transition: all 0.2s ease;
    }

    .template-action:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .template-info {
        padding: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .template-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .template-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    .templates-footer {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .template-btn {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .template-btn.secondary {
        background: var(--surface-color);
        color: var(--text-primary);
    }

    .template-btn:hover {
        opacity: 0.9;
    }

    .template-btn.secondary:hover {
        background: var(--hover-color);
    }

    /* 模板预览窗口 */
    .template-preview-window {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        display: flex;
        flex-direction: column;
    }

    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .preview-header h3 {
        margin: 0;
        color: var(--text-primary);
    }

    .preview-close {
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .preview-close:hover {
        background: var(--hover-color);
        color: var(--text-primary);
    }

    .preview-content {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
        background: var(--background-color);
    }

    .preview-slide {
        max-width: 1000px;
        margin: 0 auto;
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        min-height: 600px;
    }

    .preview-actions {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid var(--border-color);
    }

    .preview-btn {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .preview-btn.secondary {
        background: var(--surface-color);
        color: var(--text-primary);
    }

    .preview-btn:hover {
        opacity: 0.9;
    }

    .preview-btn.secondary:hover {
        background: var(--hover-color);
    }

    /* 模板演示样式 */
    .demo-cover {
        text-align: center;
        padding: 2rem;
    }

    .demo-cover h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .demo-cover p {
        color: var(--text-secondary);
        margin: 0;
    }

    .demo-content h2 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .demo-content p {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }

    .demo-content ul {
        margin: 0;
        padding-left: 1rem;
    }

    .demo-content li {
        color: var(--text-secondary);
        font-size: 0.8rem;
    }

    .demo-two-columns {
        display: flex;
        gap: 1rem;
    }

    .demo-column {
        flex: 1;
    }

    .demo-column h3 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .demo-column p {
        color: var(--text-secondary);
        margin: 0;
    }

    .demo-image-text {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .demo-image {
        width: 40px;
        height: 30px;
        background: var(--border-color);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }

    .demo-text h3 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
        color: var(--text-primary);
    }

    .demo-text p {
        color: var(--text-secondary);
        margin: 0;
    }

    .demo-code h3 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .demo-code pre {
        background: var(--surface-color);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.6rem;
        margin: 0;
        overflow: hidden;
    }

    .demo-comparison {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-align: center;
    }

    .demo-vs-left,
    .demo-vs-right {
        flex: 1;
    }

    .demo-vs-left h4,
    .demo-vs-right h4 {
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
        color: var(--text-primary);
    }

    .demo-vs-left p,
    .demo-vs-right p {
        color: var(--text-secondary);
        margin: 0;
    }

    .demo-vs-center {
        font-weight: bold;
        color: var(--text-primary);
    }

    .demo-timeline {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .demo-timeline-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .demo-timeline-date {
        width: 30px;
        font-size: 0.7rem;
        font-weight: bold;
        color: var(--primary-color);
    }

    .demo-timeline-content {
        color: var(--text-secondary);
        font-size: 0.7rem;
    }

    .demo-gallery {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }

    .demo-gallery-item {
        width: 100%;
        height: 40px;
        background: var(--border-color);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
    }

    .demo-quote {
        text-align: center;
        padding: 1rem;
    }

    .demo-quote blockquote {
        margin: 0;
        color: var(--text-primary);
        font-style: italic;
    }

    .demo-quote p {
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
    }

    .demo-quote cite {
        font-size: 0.7rem;
        color: var(--text-secondary);
    }

    .demo-contact {
        text-align: center;
    }

    .demo-contact h3 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .demo-contact p {
        font-size: 0.7rem;
        color: var(--text-secondary);
        margin: 0.25rem 0;
    }

    .demo-social {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .demo-social span {
        font-size: 0.8rem;
    }

    /* 成功消息 */
    .template-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    }

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

    /* 响应式调整 */
    @media (max-width: 768px) {
        .layout-templates-panel {
            top: 2%;
            left: 2%;
            width: 96%;
            height: 96%;
        }
        
        .templates-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
        
        .template-preview {
            height: 120px;
        }
        
        .template-categories {
            flex-wrap: wrap;
        }
        
        .category-btn {
            flex: 1;
            min-width: 80px;
        }
    }
`;

// 添加样式到页面
function addLayoutTemplateStyles() {
    if (!document.getElementById('layout-template-styles')) {
        const style = document.createElement('style');
        style.id = 'layout-template-styles';
        style.textContent = layoutTemplateStyles;
        document.head.appendChild(style);
    }
}

// 初始化布局模板
function initializeLayoutTemplates() {
    addLayoutTemplateStyles();
    const templates = new LayoutTemplates();
    window.layoutTemplates = templates;
    return templates;
}

// 显示/隐藏布局模板面板的全局函数
function showLayoutTemplates() {
    if (window.layoutTemplates) {
        window.layoutTemplates.show();
    } else {
        initializeLayoutTemplates();
        window.layoutTemplates.show();
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
window.LayoutTemplates = LayoutTemplates;
window.initializeLayoutTemplates = initializeLayoutTemplates;
window.showLayoutTemplates = showLayoutTemplates; 