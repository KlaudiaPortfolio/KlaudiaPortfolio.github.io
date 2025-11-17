// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
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
    const closeBtns = document.querySelectorAll('.modal-close');

    // Close modal function
    function closeModal() {
        overlay.classList.remove('active');
        setTimeout(() => {
            imageModal.classList.remove('active');
            videoModal.classList.remove('active');
            textModal.classList.remove('active');
            // Clear video embed when closing
            document.getElementById('videoEmbed').innerHTML = '';
        }, 400);
    }

    // Close button click
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    });

    // Prevent modal boxes from closing when clicked
    [imageModal, videoModal, textModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Click overlay to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Open Image Modal
    window.openImageModal = function(imageSrc) {
        // Close any open modals first
        imageModal.classList.remove('active');
        videoModal.classList.remove('active');
        textModal.classList.remove('active');
        
        document.getElementById('modalImage').src = imageSrc;
        overlay.classList.add('active');
        setTimeout(() => {
            imageModal.classList.add('active');
        }, 10);
    };

    // Open Video Modal
    window.openVideoModal = function(videoUrl, title, role, meta, description) {
        // Extract YouTube video ID
        let videoId = '';
        if (videoUrl.includes('youtube.com/watch?v=')) {
            videoId = videoUrl.split('v=')[1].split('&')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        }

        // Set content
        document.getElementById('videoTitle').textContent = title || 'Project Title';
        document.getElementById('videoRole').textContent = role || 'Role: ';
        document.getElementById('videoMeta').textContent = meta || '';
        document.getElementById('videoDescription').textContent = description || '';
        
        // Embed video
        if (videoId) {
            document.getElementById('videoEmbed').innerHTML = 
                `<iframe src="https://www.youtube.com/embed/${videoId}" 
                         allowfullscreen></iframe>`;
        }

        overlay.classList.add('active');
        setTimeout(() => {
            videoModal.classList.add('active');
        }, 10);
    };

    // Open Text Modal
    window.openTextModal = function(title, content) {
        document.getElementById('textTitle').textContent = title || 'Title';
        document.getElementById('textContent').innerHTML = content || '<p>Text content goes here...</p>';
        
        overlay.classList.add('active');
        setTimeout(() => {
            textModal.classList.add('active');
        }, 10);
    };

    // Auto-attach click handlers to grid items
    const gridItems = document.querySelectorAll('.grid-item img');
    gridItems.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Default to image modal for now
            openImageModal(this.src);
        });
    });
}