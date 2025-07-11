/**
 * HTML PPT 模板配置文件
 * 
 * 这个文件定义了PPT的基本设置和幻灯片信息
 * 用户可以通过修改这个文件来自定义PPT的行为
 */

// PPT 基本配置
const PPTConfig = {
    // 演示文稿标题
    title: "HTML PPT 模板",
    
    // 作者信息
    author: "Your Name",
    
    // 幻灯片文件夹配置（动态从 ppt-list.js 加载）
    slideFiles: {
        // PPT文件夹路径（动态从第一个项目获取）
        basePath: null, // 将在运行时从 ppt-list.js 的第一个项目设置
        
        // 文件排序方式：'name' | 'date' | 'custom'
        sortBy: 'name',
        
        // 幻灯片文件列表（动态加载）
        files: [],
        
        // 幻灯片标题提取方式
        titleExtraction: {
            // 从文件名提取标题
            fromFilename: true,
            // 从HTML内容中的第一个h1/h2标签提取
            fromContent: true,
            // 默认标题前缀
            defaultPrefix: "幻灯片"
        }
    },
    
    // 幻灯片信息 (动态加载)
    slides: [],
    
    // 演示设置
    settings: {
        // 是否自动播放
        autoplay: false,
        
        // 自动播放间隔 (毫秒)
        autoplayInterval: 5000,
        
        // 过渡效果 (slide, fade, zoom, none)
        transition: "slide",
        
        // 过渡动画时长 (毫秒)
        transitionDuration: 300,
        
        // 是否显示控制按钮
        showControls: true,
        
        // 是否显示进度条
        showProgress: true,
        
        // 是否启用键盘导航
        keyboard: true,
        
        // 是否启用触摸支持
        touch: true,
        
        // 是否循环播放
        loop: false,
        
        // 是否显示幻灯片编号
        showSlideNumber: true,
        
        // 移动端是否隐藏侧边栏
        hideSidebarOnMobile: true,
        
        // 是否在移动端显示底部导航
        showMobileNav: true
    },
    

    
    // 键盘快捷键配置
    keyboard: {
        // 上一张幻灯片
        prev: ['ArrowLeft', 'ArrowUp', 'PageUp'],
        
        // 下一张幻灯片
        next: ['ArrowRight', 'ArrowDown', 'PageDown', 'Space'],
        
        // 首页
        home: ['Home'],
        
        // 末页
        end: ['End'],
        
        // 全屏
        fullscreen: ['F11'],
        
        // 退出全屏
        exitFullscreen: ['Escape'],
        
        // 帮助
        help: ['KeyH', 'F1'],
        
        // 演讲者模式（暂不支持）
        // speaker: ['KeyS'],
        
        // 黑屏
        blackout: ['KeyB', 'Period']
    },
    
    // 响应式断点
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },

    
    // 版本信息
    version: "1.0.0",
    
    // 更新日志
    changelog: [
        {
            version: "1.0.0",
            date: "2024-01-01",
            changes: [
                "初始版本发布",
                "支持三种主题风格",
                "响应式设计实现",
                "键盘导航功能",
                "AI提示词模板"
            ]
        }
    ]
};

// 导出配置（兼容不同的模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PPTConfig;
}

// 使配置在全局可用
window.PPTConfig = PPTConfig;