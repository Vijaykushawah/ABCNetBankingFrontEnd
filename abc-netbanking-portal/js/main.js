// main.js
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelector('.images');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;

    function showImage(index) {
        const imageWidth = images.children[0].clientWidth;
        images.style.transform = `translateX(${-index * imageWidth}px)`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.children.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.children.length) % images.children.length;
        showImage(currentIndex);
    }

    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);

    let autoSlide = setInterval(nextImage, 3000);

    images.addEventListener('mouseover', function() {
        clearInterval(autoSlide);
    });

    images.addEventListener('mouseout', function() {
        autoSlide = setInterval(nextImage, 3000);
    });
});

// main.js
document.addEventListener('DOMContentLoaded', function() {
    const showMoreButton = document.getElementById('show-more');
    const moreLinks = document.querySelectorAll('.more-links');

    showMoreButton.addEventListener('click', function() {
        if (showMoreButton.textContent === 'Show More Links') {
            moreLinks.forEach(link => link.style.display = 'block');
            showMoreButton.textContent = 'Show Less Links';
        } else {
            moreLinks.forEach(link => link.style.display = 'none');
            showMoreButton.textContent = 'Show More Links';
        }
    });
});