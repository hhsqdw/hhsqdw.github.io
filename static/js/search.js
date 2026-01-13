// 先加载 Fuse.js 库，然后再初始化搜索
(function() {
  // 检查 Fuse.js 是否已经加载
  if (typeof Fuse === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2';
    script.onload = initSearch;
    script.onerror = function() {
      console.error('Fuse.js 加载失败');
    };
    document.head.appendChild(script);
  } else {
    initSearch();
  }
})();

function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchModal = document.getElementById('search-modal');
  const searchCount = document.getElementById('search-count');

  if (!searchInput || !searchResults || !searchModal) {
    console.error('搜索元素未找到');
    return;
  }

  let fuse = null;
  let searchData = null;

  // 先加载搜索索引数据
  fetch('/index.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('搜索索引加载失败');
      }
      return response.json();
    })
    .then(data => {
      searchData = data;
      // 初始化 Fuse.js
      fuse = new Fuse(data, {
        keys: ['title', 'content'],
        includeScore: true,
        includeMatches: true,
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2
      });
      console.log('搜索索引加载完成，共', data.length, '篇文章');
    })
    .catch(err => {
      console.error('搜索索引加载失败:', err);
      searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">搜索功能暂时不可用</div>';
    });

  // 打开/关闭搜索框
  function toggleSearch() {
    if (searchModal.style.display === 'none' || !searchModal.style.display) {
      searchModal.style.display = 'flex';
      searchInput.value = '';
      if (!fuse) {
        searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">正在加载搜索索引...</div>';
      } else {
        searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">输入关键词开始搜索...</div>';
      }
      searchCount.textContent = '';
      setTimeout(() => searchInput.focus(), 100);
    } else {
      searchModal.style.display = 'none';
    }
  }

  // 快捷键 Ctrl+F 打开搜索
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      toggleSearch();
    }
    if (e.key === 'Escape' && searchModal.style.display === 'flex') {
      searchModal.style.display = 'none';
    }
  });

  // 点击模态框背景关闭
  searchModal.addEventListener('click', function(e) {
    if (e.target === searchModal) {
      searchModal.style.display = 'none';
    }
  });

  // 搜索输入事件
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (query.length < 2) {
      searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">请输入至少 2 个字符...</div>';
      searchCount.textContent = '';
      return;
    }

    if (!fuse) {
      searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">搜索索引正在加载中...</div>';
      return;
    }

    searchTimeout = setTimeout(() => {
      try {
        const results = fuse.search(query);
        searchCount.textContent = `找到 ${results.length} 个结果`;

        if (results.length === 0) {
          searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">未找到相关内容</div>';
        } else {
          searchResults.innerHTML = results.map(result => {
            const item = result.item;
            const date = new Date(item.date).toLocaleDateString('zh-CN');
            const score = Math.round((1 - result.score) * 100);

            // 获取匹配的内容片段
            let contentPreview = '';
            if (result.matches) {
              const contentMatch = result.matches.find(m => m.key === 'content');
              if (contentMatch && contentMatch.value && contentMatch.indices && contentMatch.indices.length > 0) {
                const text = contentMatch.value;
                const index = contentMatch.indices[0];
                const start = Math.max(0, index[0] - 60);
                const end = Math.min(text.length, index[1] + 60);
                contentPreview = `${start > 0 ? '...' : ''}${text.substring(start, end)}${end < text.length ? '...' : ''}`;
              }
            }

            // 如果没有匹配内容，使用文章开头
            if (!contentPreview) {
              contentPreview = item.content.substring(0, 150) + '...';
            }

            return `
              <div style="padding: 1rem; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'" onclick="window.location.href='${item.permalink}'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                  <div style="font-weight: bold; color: #165DFF; font-size: 1.1rem;">${item.title}</div>
                  <div style="color: #999; font-size: 0.85rem; white-space: nowrap; margin-left: 1rem;">${date}</div>
                </div>
                <div style="font-size: 0.9rem; color: #666; line-height: 1.6;">${contentPreview}</div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #999;">匹配度: ${score}%</div>
              </div>
            `;
          }).join('');
        }
      } catch (err) {
        console.error('搜索出错:', err);
        searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">搜索出错，请重试</div>';
      }
    }, 300);
  });

  // 回车键搜索第一个结果
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const firstResult = searchResults.querySelector('[onclick]');
      if (firstResult) {
        firstResult.click();
      }
    }
  });
}
