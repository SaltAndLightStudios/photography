document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('blog-search');
  const tagButtons = document.querySelectorAll('.blog-tag-filter');
  const blogCards = document.querySelectorAll('.blog-card');

  // --- Search ---
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = searchInput.value.toLowerCase();
      blogCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // --- Tag filtering ---
  tagButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      blogCards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        card.style.display = tag === 'all' || tags.includes(tag) ? '' : 'none';
      });
      if (searchInput) searchInput.value = '';
    });
  });

  // --- Modal creation (once) ---
  let modalOverlay = document.querySelector('.blog-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'blog-modal-overlay';
    modalOverlay.style.display = 'none';
    modalOverlay.innerHTML = `
      <div class="blog-modal">
        <button class="blog-modal-close" aria-label="Close">&times;</button>
        <img class="blog-modal-img" style="width:100%;border-radius:0.5rem;max-height:260px;object-fit:cover;display:none;margin-bottom:1.2rem;">
        <div class="blog-modal-title"></div>
        <div class="blog-modal-meta"></div>
        <div class="blog-modal-content prose max-w-none"></div>
        <div class="blog-modal-tags"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const modal = modalOverlay.querySelector('.blog-modal');
  const modalClose = modalOverlay.querySelector('.blog-modal-close');
  const modalImg = modalOverlay.querySelector('.blog-modal-img');
  const modalTitle = modalOverlay.querySelector('.blog-modal-title');
  const modalMeta = modalOverlay.querySelector('.blog-modal-meta');
  const modalContent = modalOverlay.querySelector('.blog-modal-content');
  const modalTags = modalOverlay.querySelector('.blog-modal-tags');

  function openBlogModal(data) {
    modalTitle.textContent = data.title || '';
    modalMeta.textContent = data.meta || '';
    modalImg.src = data.img || '';
    modalImg.alt = data.imgAlt || '';
    modalImg.style.display = data.img ? '' : 'none';
    modalContent.innerHTML = data.content || '';
    modalTags.innerHTML = '';
    (data.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.className = 'blog-modal-tag px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full mr-1';
      span.textContent = tag;
      modalTags.appendChild(span);
    });
    modalOverlay.style.display = 'flex';
    modalOverlay.classList.add('active');
    document.body.classList.add('lightbox-open');
  }

  function closeBlogModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.style.display = 'none';
    document.body.classList.remove('lightbox-open');
  }

  modalClose.addEventListener('click', closeBlogModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeBlogModal();
  });

  // --- Read More functionality for each card ---
  document.querySelectorAll('.blog-card').forEach(card => {
    const readMore = card.querySelector('a');

    // Handle modal open for Read More link
    if (readMore) {
      readMore.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const url = readMore.getAttribute('href');
        try {
          const res = await fetch(url);
          const html = await res.text();
          const temp = document.createElement('div');
          temp.innerHTML = html;

          const article = temp.querySelector('article');
          const title = temp.querySelector('h1')?.textContent || '';
          const meta = temp.querySelector('strong')?.textContent || '';
          const content = article ? article.innerHTML : '<p>Content not found.</p>';

          openBlogModal({
            title,
            meta,
            content,
            tags: Array.from(card.querySelectorAll('.flex.flex-wrap span')).map(span => span.textContent),
            img: card.querySelector('img')?.src || '',
            imgAlt: card.querySelector('img')?.alt || ''
          });

        } catch (err) {
          console.error('Error loading blog content:', err);
          openBlogModal({
            title: 'Oops!',
            meta: '',
            content: '<p>There was a problem loading the blog post. Please try again later.</p>',
            tags: [],
            img: '',
            imgAlt: ''
          });
        }
      });
    }

    // Optional: also allow entire card to open modal
    card.addEventListener('click', async function (e) {
      const readMore = card.querySelector('a');
      const url = readMore?.getAttribute('href');
      if (!url) return;

      e.preventDefault();

      try {
        const res = await fetch(url);
        const html = await res.text();
        const temp = document.createElement('div');
        temp.innerHTML = html;

        const article = temp.querySelector('article');
        const title = temp.querySelector('h1')?.textContent || '';
        const meta = temp.querySelector('strong')?.textContent || '';
        const content = article ? article.innerHTML : '<p>Content not found.</p>';

        openBlogModal({
          title,
          meta,
          content,
          tags: Array.from(card.querySelectorAll('.flex.flex-wrap span')).map(span => span.textContent),
          img: card.querySelector('img')?.src || '',
          imgAlt: card.querySelector('img')?.alt || ''
        });

      } catch (err) {
        console.error('Error loading blog content:', err);
        openBlogModal({
          title: 'Oops!',
          meta: '',
          content: '<p>There was a problem loading the blog post. Please try again later.</p>',
          tags: [],
          img: '',
          imgAlt: ''
        });
      }
    });
  });
    // --- PAGINATION SETUP ---
    const postsContainer = document.getElementById('blog-posts-container');
    const posts = Array.from(postsContainer.querySelectorAll('.blog-post'));
    const perPage = 3;
    let currentPage = 1;
    const totalPages = Math.ceil(posts.length / perPage);

    // Generate pagination buttons dynamically
    const paginationEl = document.getElementById('blog-pagination');
    paginationEl.innerHTML = `
  <button class="blog-pagination-btn prev" disabled>‹</button>
  ${Array.from({ length: totalPages }, (_, i) =>
        `<button class="blog-pagination-btn page">${i + 1}</button>`
    ).join('')}
  <button class="blog-pagination-btn next">›</button>
`;

    // Show/hide posts for a given page
    function renderPage(page) {
        currentPage = page;
        const start = (page - 1) * perPage;
        posts.forEach((post, i) => {
            post.style.display = (i >= start && i < start + perPage) ? '' : 'none';
        });
        updateControls();
    }

    // Update button states and active class
    function updateControls() {
        document.querySelector('#blog-pagination .prev').disabled = currentPage === 1;
        document.querySelector('#blog-pagination .next').disabled = currentPage === totalPages;
        document.querySelectorAll('#blog-pagination .page').forEach(btn => {
            btn.classList.toggle('active', Number(btn.textContent) === currentPage);
        });
    }

    // Event listeners for pagination controls
    document.querySelector('#blog-pagination .prev')
        .addEventListener('click', () => renderPage(currentPage - 1));
    document.querySelector('#blog-pagination .next')
        .addEventListener('click', () => renderPage(currentPage + 1));
    document.querySelectorAll('#blog-pagination .page')
        .forEach(btn => btn.addEventListener('click', () => renderPage(Number(btn.textContent))));

    // Initialize
    renderPage(1);
    // --- END PAGINATION SETUP ---

    // (Optional) Pagination logic can be added here if you enable pagination
});
// Implement pagination logic here
// Example: show/hide blog cards based on page number
//});
//});
//});
