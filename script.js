// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // If this is a same-page anchor (starts with #), do smooth scroll
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // If this is a link to index.html (optionally with #...), let the browser handle navigation
            // e.g. index.html, index.html#about, index.html#contact
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.backgroundColor = '#000';
        }
    });
    
    // Fade in animation for about section
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe about section elements
    const aboutElements = document.querySelectorAll('.about-image, .about-content');
    aboutElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });

    // Modal System
    initModalSystem();
});

function initModalSystem() {
    const overlay = document.getElementById('modalOverlay');
    const imageModal = document.getElementById('imageModal');
    const videoModal = document.getElementById('videoModal');
    const textModal = document.getElementById('textModal');
    const dualModal = document.getElementById('dualModal');
    const closeBtns = document.querySelectorAll('.modal-close');

    // Close modal function
    function closeModal() {
        if (!overlay) return;

        overlay.classList.remove('active');

        if (imageModal) imageModal.classList.remove('active');
        if (videoModal) videoModal.classList.remove('active');
        if (textModal) textModal.classList.remove('active');
        if (dualModal) dualModal.classList.remove('active', 'show-video');

        const videoEmbed = document.getElementById('videoEmbed');
        if (videoEmbed) videoEmbed.innerHTML = '';
        const dualVideoEmbed = document.getElementById('dualVideoEmbed');
        if (dualVideoEmbed) dualVideoEmbed.innerHTML = '';
        if (dualModal && dualModal.dataset) dualModal.dataset.videoUrl = '';
    }

    // Close button click
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    });

    // Prevent modal boxes from closing when clicked
    [imageModal, videoModal, textModal, dualModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Click overlay to close
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // ESC to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Open Image Modal
    window.openImageModal = function(imageSrc) {
        if (!overlay || !imageModal) return;
        closeModal();
        const modalImage = document.getElementById('modalImage');
        if (!modalImage) return;
        modalImage.src = imageSrc;
        overlay.classList.add('active');
        imageModal.classList.add('active');
    };

    // Open Video Modal
    window.openVideoModal = function(videoUrl, title, role, meta, description) {
        if (!overlay || !videoModal) return;

        closeModal();

        // Extract YouTube video ID
        let videoId = '';
        if (videoUrl.includes('youtube.com/watch?v=')) {
            videoId = videoUrl.split('v=')[1].split('&')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        }

        // Set content
        const titleEl = document.getElementById('videoTitle');
        const roleEl = document.getElementById('videoRole');
        const metaEl = document.getElementById('videoMeta');
        const descEl = document.getElementById('videoDescription');

        if (titleEl) titleEl.textContent = title || 'Project Title';
        if (roleEl) roleEl.textContent = role || 'Role: ';
        if (metaEl) metaEl.textContent = meta || '';
        if (descEl) descEl.textContent = description || '';
        
        // Embed video
        if (videoId) {
            const videoEmbed = document.getElementById('videoEmbed');
            if (videoEmbed) {
                videoEmbed.innerHTML = 
                    `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
            }
        }

        overlay.classList.add('active');
        videoModal.classList.add('active');
    };

    // Open Text Modal
    window.openTextModal = function(title, content) {
        if (!overlay || !textModal) return;

        closeModal();

        const textTitle = document.getElementById('textTitle');
        const textContent = document.getElementById('textContent');

        if (textTitle) textTitle.textContent = title || 'Title';
        if (textContent) textContent.innerHTML = content || '<p>Text content goes here...</p>';
        
        overlay.classList.add('active');
        textModal.classList.add('active');
    };

    // Open Dual Video/Text Modal
    window.openDualVideoModal = function(title, textHtml, videoUrl) {
        if (!overlay || !dualModal) return;
        closeModal();
        dualModal.classList.remove('show-video');
        const dualTitle = document.getElementById('dualTitle');
        const dualTextContent = document.getElementById('dualTextContent');
        const dualVideoEmbed = document.getElementById('dualVideoEmbed');
        if (dualTitle) dualTitle.textContent = title || '';
        if (dualTextContent) dualTextContent.innerHTML = textHtml || '';
        if (dualVideoEmbed) dualVideoEmbed.innerHTML = '';
        dualModal.dataset.videoUrl = videoUrl || '';
        overlay.classList.add('active');
        dualModal.classList.add('active');
    };

    function extractYouTubeId(url) {
        if (!url) return '';
        try {
            if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
            if (url.includes('youtube.com/watch')) {
                const params = new URLSearchParams(url.split('?')[1]);
                return params.get('v') || '';
            }
            if (url.includes('youtube.com/shorts/')) return url.split('youtube.com/shorts/')[1].split('?')[0];
        } catch(e) { return ''; }
        return '';
    }

    // Outside navigation buttons (text -> video, video -> text)
    if (dualModal) {
        const nextBtn = dualModal.querySelector('.next-outside');
        const backBtn = dualModal.querySelector('.back-outside');
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!dualModal.classList.contains('show-video')) {
                    const vidUrl = dualModal.dataset.videoUrl;
                    const vidId = extractYouTubeId(vidUrl);
                    const dualVideoEmbed = document.getElementById('dualVideoEmbed');
                    if (vidId && dualVideoEmbed && !dualVideoEmbed.querySelector('iframe')) {
                        dualVideoEmbed.innerHTML = `<iframe src="https://www.youtube.com/embed/${vidId}" allowfullscreen></iframe>`;
                    }
                    dualModal.classList.add('show-video');
                }
            });
        }
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                dualModal.classList.remove('show-video');
            });
        }
    }

    // Auto-attach click handlers to grid items with images (not onclick handlers)
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        // Only add image modal handler if the item doesn't have an onclick attribute
        if (!item.hasAttribute('onclick')) {
            const img = item.querySelector('img');
            if (img) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openImageModal(img.src);
                });
            }
        }
    });
}
