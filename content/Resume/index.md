---
title: "简历"
date: 2026-01-13T00:00:00Z
draft: false
type: "resume"
---

{{< rawhtml >}}
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leo - Java后端简历</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#165DFF',
                        secondary: '#36465D',
                        accent: '#0FC6C2',
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                }
            }
        }
    </script>

    <style type="text/tailwindcss">
        @layer utilities {
            .resume-card {
                @apply bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg;
            }
            .section-title {
                @apply text-xl md:text-2xl font-bold text-secondary mb-4 flex items-center border-l-4 border-primary pl-3;
            }
            .info-item {
                @apply flex items-start mb-3;
            }
            .info-icon {
                @apply text-primary mt-1 mr-3;
            }
        }
    </style>
</head>
<body class="bg-gray-50 font-sans text-gray-700">
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-xl md:text-2xl font-bold text-primary">Leo - Java后端</h1>
            <nav class="hidden md:flex space-x-6">
                <a href="#basic-info" class="text-gray-600 hover:text-primary transition-colors">基本信息</a>
                <a href="#education" class="text-gray-600 hover:text-primary transition-colors">教育经历</a>
                <a href="#projects" class="text-gray-600 hover:text-primary transition-colors">项目经历</a>
                <a href="#skills" class="text-gray-600 hover:text-primary transition-colors">专业技能</a>
            </nav>
            <button id="menuBtn" class="md:hidden text-gray-600">
                <i class="fa fa-bars text-xl"></i>
            </button>
        </div>
        <div id="mobileMenu" class="hidden md:hidden bg-white border-t">
            <div class="container mx-auto px-4 py-2 flex flex-col space-y-3">
                <a href="#basic-info" class="py-2 text-gray-600 hover:text-primary transition-colors">基本信息</a>
                <a href="#education" class="py-2 text-gray-600 hover:text-primary transition-colors">教育经历</a>
                <a href="#projects" class="py-2 text-gray-600 hover:text-primary transition-colors">项目经历</a>
                <a href="#skills" class="py-2 text-gray-600 hover:text-primary transition-colors">专业技能</a>
            </div>
        </div>
    </header>

    <main class="container mx-auto px-4 py-8 md:py-12">
        <div class="max-w-4xl mx-auto">
            <section id="basic-info" class="resume-card">
                <h2 class="section-title">
                    <i class="fa fa-user-circle-o mr-2"></i>基本信息
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="info-item">
                        <i class="fa fa-envelope info-icon"></i>
                        <div>
                            <span class="font-medium">邮箱：</span>
                            <a href="mailto:hhsqdmz@163.com" class="text-primary hover:underline">hhsqdmz@163.com</a>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fa fa-map-marker info-icon"></i>
                        <div>
                            <span class="font-medium">所在地：</span>
                            <span>广东</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="education" class="resume-card">
                <h2 class="section-title">
                    <i class="fa fa-graduation-cap mr-2"></i>教育经历
                </h2>
                <div class="border-l-2 border-primary/30 pl-5 ml-2">
                    <div class="mb-6 relative">
                        <div class="absolute -left-[32px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
                        <h3 class="font-bold text-lg text-secondary">广东白云学院</h3>
                        <p class="text-gray-500 text-sm mb-2">2023/09/01 - 2027/06/30</p>
                        <p class="mb-3"><span class="font-medium">专业：</span>计算机科学与技术 · 本科</p>

                        <div>
                            <h4 class="font-medium text-primary mb-2">荣誉/奖项：</h4>
                            <ul class="list-disc list-inside space-y-1 text-gray-600">
                                <li>第十六届蓝桥杯全国软件和信息技术JAVA程序设计 - 二等奖</li>
                                <li>广东白云学院第五届算法设计竞赛 - 二等奖</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects" class="resume-card">
                <h2 class="section-title">
                    <i class="fa fa-code-fork mr-2"></i>项目经历
                </h2>

                <div class="mb-8 pb-8 border-b border-gray-100">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                        <h3 class="font-bold text-lg text-secondary">视界职通——就业数据可视化系统</h3>
                        <span class="text-primary font-medium">后端开发</span>
                    </div>
                    <p class="text-gray-500 text-sm mb-3">2025/07 - 2025/10</p>
                    <p class="text-gray-600 mb-3"><span class="font-medium">技术栈：</span>SpringBoot, MyBatis-Plus, Spring AI, MongoDB</p>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>搭建简历生成模块，通过调用 aspose-words 库实现模板内容自动化填充。</li>
                        <li>搭建 RAG 线上知识库，实现智能体与知识库的精准检索关联。</li>
                        <li>基于 Tool Calling 实现自然语言驱动的简历生成。</li>
                        <li>设计 Prompt 机制，有效解决大模型信息编造风险。</li>
                    </ul>
                </div>

                <div>
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                        <h3 class="font-bold text-lg text-secondary">云驰-智能车主管家</h3>
                        <span class="text-primary font-medium">后端开发</span>
                    </div>
                    <p class="text-gray-500 text-sm mb-3">2024/11 - 2025/03</p>
                    <p class="text-gray-600 mb-3"><span class="font-medium">技术栈：</span>Spring Cloud Alibaba, MyBatis-Plus, Redis, RabbitMQ, Drools</p>
                    <ul class="list-disc list-inside space-y-2 text-gray-600">
                        <li>集成腾讯云地图API实现实时定位；结合 OCR 识别实现证件信息采集持久化。</li>
                        <li>通过分布式锁 Redisson 结合乐观锁版本号字段，实现严谨的"一人一单"。</li>
                        <li>利用 RabbitMQ 解耦订单流程，通过幂等控制保障数据一致性。</li>
                        <li>编写 Drools 规则文件实现业务规则动态转换。</li>
                        <li>使用 CompletableFuture 实现线程异步编排，提升执行效率。</li>
                    </ul>
                </div>
            </section>

            <section id="skills" class="resume-card">
                <h2 class="section-title">
                    <i class="fa fa-cogs mr-2"></i>专业技能
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-bold text-lg text-secondary mb-3">核心架构与开发</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                熟悉 Spring、Spring Boot、MyBatis Plus 框架及 IOC、AOP 原理。
                            </li>
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                掌握 Spring Cloud Alibaba 生态（Nacos、Gateway）。
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-secondary mb-3">中间件与前沿技术</h3>
                        <ul class="space-y-2 text-gray-600">
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                熟悉 Redis 数据结构及 AOF 持久化，解决缓存击穿等问题。
                            </li>
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                熟悉 Spring AI、LangChain4j，具备智能体构建经验。
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="bg-secondary text-white py-6">
        <div class="container mx-auto px-4 text-center">
            <p class="mb-2">Leo - Java后端</p>
            <p class="text-gray-300 text-sm">© 2026 个人简历 | 邮箱：hhsqdmz@163.com</p>
        </div>
    </footer>

    <script>
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        menuBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                mobileMenu.classList.add('hidden');
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>
{{< /rawhtml >}}
