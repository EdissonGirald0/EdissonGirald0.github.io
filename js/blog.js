document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const searchInput = document.getElementById('searchInput');
    const tagsFilter = document.getElementById('tagsFilter');
    const modal = document.getElementById('post-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    let allPosts = [];
    let activeTag = null;

    // Fetch posts
    fetch('data/posts.json')
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            renderPosts(posts);
            renderTags(posts);
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            blogGrid.innerHTML = '<p>Error al cargar los artículos. Por favor intenta más tarde.</p>';
        });

    // Render posts to grid
    function renderPosts(posts) {
        blogGrid.innerHTML = '';
        
        if (posts.length === 0) {
            blogGrid.innerHTML = '<p>No se encontraron artículos.</p>';
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.onclick = () => openPost(post);

            const tagsHtml = post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('');

            card.innerHTML = `
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="blog-card-content">
                    <div class="blog-date"><i class="far fa-calendar-alt"></i> ${formatDate(post.date)}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-summary">${post.summary}</p>
                    <div class="blog-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    }

    // Render unique tags for filter
    function renderTags(posts) {
        const tags = new Set();
        posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
        
        tagsFilter.innerHTML = '<button class="tag-btn active" data-tag="all">Todos</button>';
        
        tags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'tag-btn';
            btn.textContent = tag;
            btn.dataset.tag = tag;
            btn.onclick = () => filterByTag(tag, btn);
            tagsFilter.appendChild(btn);
        });

        // Add event listener to "Todos" button
        tagsFilter.querySelector('[data-tag="all"]').onclick = (e) => filterByTag(null, e.target);
    }

    // Filter logic
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        
        const filtered = allPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                                  post.summary.toLowerCase().includes(searchTerm);
            const matchesTag = activeTag ? post.tags.includes(activeTag) : true;
            
            return matchesSearch && matchesTag;
        });

        renderPosts(filtered);
    }

    function filterByTag(tag, btnElement) {
        activeTag = tag;
        
        // Update UI
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
        
        filterPosts();
    }

    // Search input listener
    searchInput.addEventListener('input', filterPosts);

    // Open Post Modal
    function openPost(post) {
        const tagsHtml = post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('');
        
        modalBody.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="post-detail-image">
            <div class="post-detail-content">
                <div class="post-detail-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(post.date)}</span>
                    <span style="margin-left: 15px;"><i class="far fa-user"></i> ${post.author}</span>
                </div>
                <h1>${post.title}</h1>
                <div class="blog-tags" style="margin-bottom: 20px;">${tagsHtml}</div>
                <div class="post-body">
                    ${post.content}
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal
    closeModal.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Helper: Format Date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
});
