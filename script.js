document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'Images/Image2.jpg',
        'Images/Image3.jpg',
        'Images/Image4.jpg',
        'Images/Image5.jpg',
    ];
    let currentIndex = 0; 
    const carouselTrack = document.querySelector('.carousel-track');
    const imgElements = carouselTrack.querySelectorAll('.carousel-img');

    if (imgElements.length !== 3) {
        console.error('Carousel requires exactly 3 img tags in the HTML.');
        return;
    }

    let domImageSlots = Array.from(imgElements);

    function renderCarousel() {
        const totalImages = images.length;
        if (totalImages === 0) {
            carouselTrack.innerHTML = '<p style="color: white; text-align: center;">No images to display.</p>';
            return;
        }

        // Determine data indices for prev, current (active), and next images
        const prevDataIndex = (currentIndex - 1 + totalImages) % totalImages;
        const currentDataIndex = currentIndex;
        const nextDataIndex = (currentIndex + 1) % totalImages;

        domImageSlots.forEach(img => img.classList.remove('active', 'prev', 'next'));

        domImageSlots[0].src = images[prevDataIndex];
        domImageSlots[0].classList.add('prev');

        domImageSlots[1].src = images[currentDataIndex];
        domImageSlots[1].classList.add('active');

        domImageSlots[2].src = images[nextDataIndex];
        domImageSlots[2].classList.add('next');
    }

    carouselTrack.addEventListener('click', (event) => {
        const clickedImage = event.target;

        if (!clickedImage.classList.contains('carousel-img')) {
            return; 
        }

        const totalImages = images.length;
        if (totalImages === 0) return;

        if (clickedImage.classList.contains('prev')) {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;

            const lastEl = domImageSlots.pop();
            domImageSlots.unshift(lastEl);

            renderCarousel();
        } else if (clickedImage.classList.contains('next')) {
            currentIndex = (currentIndex + 1) % totalImages;

            const firstEl = domImageSlots.shift();
            domImageSlots.push(firstEl);

            renderCarousel();
        }
    });

    // Initial render
    if (images.length > 0) {
        renderCarousel();
    }

    // Auto-scroll every 5 seconds
    setInterval(() => {
        const totalImages = images.length;
        if (totalImages === 0) return;
        currentIndex = (currentIndex + 1) % totalImages;
        const firstEl = domImageSlots.shift();
        domImageSlots.push(firstEl);
        renderCarousel();
    }, 5000);
});