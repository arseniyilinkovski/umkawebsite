// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTop) {
        backToTop.classList.toggle('show', window.pageYOffset > 300);
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (!href.startsWith('tel:') && !href.startsWith('mailto:')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// PRICE TOGGLE
const toggleBtns = document.querySelectorAll('.toggle-price-btn');
toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = btn.closest('.price-category').querySelector('.price-items-wrapper');
        
        wrapper.classList.toggle('open');
        if (wrapper.classList.contains('open')) {
            btn.innerHTML = '<i class="fas fa-chevron-up"></i> Скрыть цены';
        } else {
            btn.innerHTML = '<i class="fas fa-chevron-down"></i> Узнать цену';
        }
    });
});

// GALLERY SLIDER с поддержкой нескольких видео, звука и паузы
const sliderWrapper = document.getElementById('sliderWrapper');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('sliderDots');

if (sliderWrapper && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Функция для управления всеми видео (пауза/воспроизведение)
    function manageVideos() {
        slides.forEach((slide, index) => {
            const video = slide.querySelector('.slide-video');
            if (video) {
                if (index === currentIndex) {
                    // Активный слайд - воспроизводим видео
                    video.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
                    slide.classList.add('active-video');
                    
                    // Обновляем иконку play/pause (если видео играет - показываем паузу)
                    const playPauseBtn = slide.querySelector('.video-play-pause-btn');
                    if (playPauseBtn && !video.paused) {
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    }
                } else {
                    // Неактивный слайд - ставим на паузу и сбрасываем
                    video.pause();
                    video.currentTime = 0;
                    slide.classList.remove('active-video');
                    
                    // Обновляем иконку play/pause
                    const playPauseBtn = slide.querySelector('.video-play-pause-btn');
                    if (playPauseBtn) {
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            }
        });
    }
    
    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        manageVideos();
    }
    
    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }
    
    createDots();
    updateSlider();
}

// УПРАВЛЕНИЕ ДЛЯ ВСЕХ ВИДЕО (звук + пауза/воспроизведение)
document.querySelectorAll('.video-slide').forEach(videoSlide => {
    const video = videoSlide.querySelector('.slide-video');
    const playPauseBtn = videoSlide.querySelector('.video-play-pause-btn');
    const soundBtn = videoSlide.querySelector('.video-sound-btn');
    
    if (!video) return;
    
    let isSoundEnabled = false;
    
    // Кнопка play/pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        // Следим за окончанием видео (для loop)
        video.addEventListener('ended', () => {
            if (video.loop) {
                video.play();
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }
    
    // Кнопка звука
    if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isSoundEnabled) {
                video.muted = true;
                soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isSoundEnabled = false;
            } else {
                video.muted = false;
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                isSoundEnabled = true;
                
                if (video.paused) {
                    video.play();
                    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
            }
        });
    }
    
    // При смене слайда сбрасываем звук для неактивных видео
    const observer = new MutationObserver(() => {
        const isActive = videoSlide.classList.contains('active-video');
        if (!isActive) {
            if (isSoundEnabled) {
                video.muted = true;
                if (soundBtn) soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isSoundEnabled = false;
            }
        } else {
            // Если видео стало активным и на паузе - показываем play
            if (video.paused && playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    });
    
    observer.observe(videoSlide, { attributes: true, attributeFilter: ['class'] });
});

// Animation on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.direction-card, .price-item, .expert-content, .review-card').forEach(el => {
    observer.observe(el);
});