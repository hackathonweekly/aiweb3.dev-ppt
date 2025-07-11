/**
 * HTML PPT 模板 - 代码高亮模块
 * 
 * 实现代码语法高亮功能，支持多种编程语言
 * 使用纯JavaScript实现，无需外部依赖
 */

class CodeHighlighter {
    constructor() {
        this.languages = {
            javascript: {
                keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'true', 'false', 'null', 'undefined'],
                operators: ['=', '+', '-', '*', '/', '%', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '!', '?', ':', '=>'],
                strings: ['"', "'", '`'],
                comments: ['//', '/*', '*/']
            },
            python: {
                keywords: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'],
                operators: ['=', '+', '-', '*', '/', '//', '%', '**', '==', '!=', '<', '>', '<=', '>='],
                strings: ['"', "'", '"""', "'''"],
                comments: ['#']
            },
            html: {
                tags: ['html', 'head', 'body', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button'],
                attributes: ['class', 'id', 'src', 'href', 'alt', 'title', 'style', 'onclick', 'onload'],
                symbols: ['<', '>', '=', '"', "'"]
            },
            css: {
                properties: ['color', 'background', 'font-size', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom'],
                values: ['auto', 'none', 'block', 'inline', 'flex', 'grid', 'absolute', 'relative', 'fixed'],
                units: ['px', 'em', 'rem', '%', 'vh', 'vw'],
                symbols: ['{', '}', ':', ';', '#', '.']
            }
        };
        
        this.init();
    }

    init() {
        // 查找页面中的代码块并高亮
        this.highlightAll();
        
        // 监听动态添加的代码块
        this.observeChanges();
    }

    highlightAll() {
        const codeBlocks = document.querySelectorAll('pre code, .code-block, .highlight');
        codeBlocks.forEach(block => this.highlightBlock(block));
    }

    highlightBlock(element) {
        const language = this.detectLanguage(element);
        const code = element.textContent;
        const highlightedCode = this.highlight(code, language);
        
        element.innerHTML = highlightedCode;
        element.classList.add('hljs', `language-${language}`);
        
        // 添加行号
        if (!element.classList.contains('no-line-numbers')) {
            this.addLineNumbers(element);
        }
        
        // 添加复制按钮
        this.addCopyButton(element);
    }

    detectLanguage(element) {
        // 从class属性检测语言
        const classList = element.className;
        const langMatch = classList.match(/(?:language-|lang-)(\w+)/);
        if (langMatch) {
            return langMatch[1];
        }
        
        // 从data属性检测
        const dataLang = element.getAttribute('data-language');
        if (dataLang) {
            return dataLang;
        }
        
        // 自动检测
        const code = element.textContent;
        return this.autoDetectLanguage(code);
    }

    autoDetectLanguage(code) {
        // 简单的语言检测逻辑
        if (code.includes('function') || code.includes('const') || code.includes('=>')) {
            return 'javascript';
        }
        if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
            return 'python';
        }
        if (code.includes('<html') || code.includes('<div') || code.includes('</')) {
            return 'html';
        }
        if (code.includes('{') && code.includes(':') && code.includes(';')) {
            return 'css';
        }
        
        return 'text';
    }

    highlight(code, language) {
        if (!this.languages[language]) {
            return this.escapeHtml(code);
        }

        let highlightedCode = this.escapeHtml(code);
        
        switch (language) {
            case 'javascript':
                highlightedCode = this.highlightJavaScript(highlightedCode);
                break;
            case 'python':
                highlightedCode = this.highlightPython(highlightedCode);
                break;
            case 'html':
                highlightedCode = this.highlightHTML(highlightedCode);
                break;
            case 'css':
                highlightedCode = this.highlightCSS(highlightedCode);
                break;
        }

        return highlightedCode;
    }

    highlightJavaScript(code) {
        const lang = this.languages.javascript;
        
        // 高亮字符串
        code = code.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="hljs-string">$1$2$1</span>');
        
        // 高亮注释
        code = code.replace(/\/\/.*$/gm, '<span class="hljs-comment">$&</span>');
        code = code.replace(/\/\*[\s\S]*?\*\//g, '<span class="hljs-comment">$&</span>');
        
        // 高亮关键字
        lang.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="hljs-keyword">${keyword}</span>`);
        });
        
        // 高亮数字
        code = code.replace(/\b\d+(\.\d+)?\b/g, '<span class="hljs-number">$&</span>');
        
        // 高亮函数调用
        code = code.replace(/\b(\w+)\s*\(/g, '<span class="hljs-function">$1</span>(');
        
        return code;
    }

    highlightPython(code) {
        const lang = this.languages.python;
        
        // 高亮字符串
        code = code.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '<span class="hljs-string">$1</span>');
        
        // 高亮注释
        code = code.replace(/#.*$/gm, '<span class="hljs-comment">$&</span>');
        
        // 高亮关键字
        lang.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="hljs-keyword">${keyword}</span>`);
        });
        
        // 高亮数字
        code = code.replace(/\b\d+(\.\d+)?\b/g, '<span class="hljs-number">$&</span>');
        
        // 高亮函数定义
        code = code.replace(/\bdef\s+(\w+)/g, 'def <span class="hljs-function">$1</span>');
        
        return code;
    }

    highlightHTML(code) {
        // 高亮HTML标签
        code = code.replace(/&lt;(\/?[\w\-]+)([^&]*?)&gt;/g, (match, tagName, attributes) => {
            let result = `&lt;<span class="hljs-tag">${tagName}</span>`;
            
            // 高亮属性
            attributes = attributes.replace(/(\w+)=("[^"]*"|'[^']*')/g, '<span class="hljs-attribute">$1</span>=<span class="hljs-string">$2</span>');
            
            return result + attributes + '&gt;';
        });
        
        return code;
    }

    highlightCSS(code) {
        // 高亮CSS选择器
        code = code.replace(/^([^{]+)\s*{/gm, '<span class="hljs-selector">$1</span> {');
        
        // 高亮属性名
        code = code.replace(/\b(\w+(?:-\w+)*)\s*:/g, '<span class="hljs-property">$1</span>:');
        
        // 高亮值
        code = code.replace(/:([^;]+);/g, ': <span class="hljs-value">$1</span>;');
        
        // 高亮颜色值
        code = code.replace(/#[0-9a-fA-F]{3,6}/g, '<span class="hljs-color">$&</span>');
        
        return code;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addLineNumbers(element) {
        const lines = element.innerHTML.split('\n');
        const lineNumbers = lines.map((_, index) => 
            `<span class="line-number">${index + 1}</span>`
        ).join('\n');
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        const numbersDiv = document.createElement('div');
        numbersDiv.className = 'line-numbers';
        numbersDiv.innerHTML = lineNumbers;
        
        const codeDiv = document.createElement('div');
        codeDiv.className = 'code-content';
        codeDiv.innerHTML = element.innerHTML;
        
        wrapper.appendChild(numbersDiv);
        wrapper.appendChild(codeDiv);
        
        element.innerHTML = '';
        element.appendChild(wrapper);
    }

    addCopyButton(element) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = '复制代码';
        
        copyBtn.addEventListener('click', () => {
            const code = element.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
        
        // 将复制按钮添加到代码块的父元素
        const container = element.closest('pre') || element;
        container.style.position = 'relative';
        container.appendChild(copyBtn);
    }

    observeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const codeBlocks = node.querySelectorAll ? 
                            node.querySelectorAll('pre code, .code-block, .highlight') : [];
                        codeBlocks.forEach(block => this.highlightBlock(block));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 代码高亮样式
const codeHighlightStyles = `
    /* 代码高亮样式 */
    .hljs {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin: 1rem 0;
        overflow-x: auto;
        font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        position: relative;
    }

    .hljs-keyword {
        color: #d73a49;
        font-weight: 600;
    }

    .hljs-string {
        color: #032f62;
    }

    .hljs-comment {
        color: #6a737d;
        font-style: italic;
    }

    .hljs-number {
        color: #005cc5;
    }

    .hljs-function {
        color: #6f42c1;
        font-weight: 600;
    }

    .hljs-tag {
        color: #22863a;
    }

    .hljs-attribute {
        color: #6f42c1;
    }

    .hljs-selector {
        color: #6f42c1;
        font-weight: 600;
    }

    .hljs-property {
        color: #005cc5;
    }

    .hljs-value {
        color: #032f62;
    }

    .hljs-color {
        color: #e36209;
        font-weight: 600;
    }

    .code-wrapper {
        display: flex;
        background: var(--surface-color);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .line-numbers {
        background: var(--background-color);
        border-right: 1px solid var(--border-color);
        padding: 1rem 0.5rem;
        font-size: 0.8rem;
        color: var(--text-muted);
        text-align: right;
        min-width: 3rem;
        user-select: none;
    }

    .line-number {
        display: block;
        line-height: 1.5;
    }

    .code-content {
        flex: 1;
        padding: 1rem;
        overflow-x: auto;
    }

    .code-copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        font-size: 0.8rem;
        color: var(--text-secondary);
        transition: all 0.2s ease;
        opacity: 0.7;
    }

    .code-copy-btn:hover {
        opacity: 1;
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .code-copy-btn.copied {
        background: var(--success-color);
        color: white;
        border-color: var(--success-color);
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
        .hljs {
            font-size: 0.8rem;
            padding: 0.75rem;
        }
        
        .line-numbers {
            min-width: 2.5rem;
            padding: 0.75rem 0.25rem;
            font-size: 0.7rem;
        }
        
        .code-content {
            padding: 0.75rem;
        }
        
        .code-copy-btn {
            top: 0.25rem;
            right: 0.25rem;
            padding: 0.25rem;
            font-size: 0.7rem;
        }
    }
`;

// 添加样式到页面
function addCodeHighlightStyles() {
    if (!document.getElementById('code-highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'code-highlight-styles';
        style.textContent = codeHighlightStyles;
        document.head.appendChild(style);
    }
}

// 初始化代码高亮
function initializeCodeHighlight() {
    addCodeHighlightStyles();
    const highlighter = new CodeHighlighter();
    window.codeHighlighter = highlighter;
    return highlighter;
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCodeHighlight);
} else {
    initializeCodeHighlight();
}

// 导出到全局
window.CodeHighlighter = CodeHighlighter;
window.initializeCodeHighlight = initializeCodeHighlight; 