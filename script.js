/* ==========================================================================
   INTERACTIVE LOGIC FOR CYIO'S SURPRISE WEBSITE
   Includes Dynamic Hearts, Spotify Player Controller, & Reveal Triggers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const landingScreen = document.getElementById('landingScreen');
    const giftBoxBtn = document.getElementById('giftBoxBtn');
    const mainContent = document.getElementById('mainContent');
    const audio = document.getElementById('romantic-audio');
    
    // Player elements
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const albumCover = document.querySelector('.player-album-cover');
    const visualizer = document.getElementById('visualizer');
    
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');
    const progressKnob = document.getElementById('progressKnob');
    const currentTimeEl = document.getElementById('currentTime');
    const totalDurationEl = document.getElementById('totalDuration');
    
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeOnIcon = document.getElementById('volumeOnIcon');
    const volumeMuteIcon = document.getElementById('volumeMuteIcon');
    const volumeSliderBg = document.getElementById('volumeSliderBg');
    const volumeSliderFill = document.getElementById('volumeSliderFill');
    
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const trackName = document.getElementById('trackName');

    // Lightbox elements
    const photoLightbox = document.getElementById('photoLightbox');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');
    const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    
    let isPlaying = false;
    let isMuted = false;
    let isRepeat = false;
    let currentVolume = 0.8;

    // --- Floating Heart Generator ---
    const heartsContainer = document.getElementById('hearts-container');
    const heartSVGs = [
        `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`, // Standard Heart
        `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" style="transform: scale(0.85); transform-origin: center;"/>` // Dainty Heart
    ];
    
    const heartColors = [
        '#FF6B8B', // Primary Rose
        '#FF4B72', // Darker Rose
        '#FF85A1', // Light Pink
        '#FFB3C6', // Softest Pink
        '#D4AF37'  // Gold Accent
    ];

    function createHeart(isBurst = false) {
        if (!heartsContainer) return;

        const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        heart.setAttribute('viewBox', '0 0 24 24');
        heart.classList.add('floating-heart');
        
        const randomShape = heartSVGs[Math.floor(Math.random() * heartSVGs.length)];
        heart.innerHTML = randomShape;

        const size = Math.floor(Math.random() * 23) + 12;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;

        const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
        heart.style.fill = randomColor;

        let startX, startY;
        if (isBurst) {
            startX = 50 + (Math.random() * 20 - 10);
            startY = 50 + (Math.random() * 20 - 10);
            heart.style.left = `${startX}%`;
            heart.style.bottom = `${100 - startY}%`;
            
            const duration = (Math.random() * 3) + 3;
            heart.style.animation = `floatHeart ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
        } else {
            startX = Math.random() * 100;
            heart.style.left = `${startX}%`;
            
            const duration = (Math.random() * 6) + 7;
            const delay = Math.random() * 2;
            heart.style.animationDuration = `${duration}s`;
            heart.style.animationDelay = `${delay}s`;
        }

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 13000);
    }

    let heartGeneratorInterval = setInterval(() => createHeart(false), 800);


    // --- UNBOXING SURPRISE ACTION ---
    if (giftBoxBtn) {
        giftBoxBtn.addEventListener('click', () => {
            landingScreen.classList.add('unboxed');
            
            for (let i = 0; i < 35; i++) {
                setTimeout(() => createHeart(true), i * 30);
            }
            
            setTimeout(() => {
                landingScreen.style.display = 'none';
                mainContent.style.display = 'block';
                
                void mainContent.offsetWidth;
                mainContent.classList.add('visible');
                
                playAudio();
                revealOnScroll();
            }, 1100);
        });
    }


    // --- SPOTIFY MUSIC PLAYER CONTROLLER ---
    const playlist = [
        { title: "You're Gonna Live Forever in Me", artist: "John Mayer", src: "music/song1.mp3", fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "3:09" },
        { title: "You’re Still The One", artist: "Shania Twain", src: "music/song2.mp3", fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "3:20" },
        { title: "Helena", artist: "My Chemical Romance", src: "music/song3.mp3", fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "3:29" },
        { title: "Last Night On Earth", artist: "Green Day", src: "music/song4.mp3", fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "3:57" },
        { title: "All Of Me", artist: "John Legend", src: "music/song5.mp3", fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", duration: "05:07" }
    ];
    let currentTrackIndex = 0;

    audio.volume = currentVolume;

    // Load track and update all text / playlist markings
    function loadTrack(index, shouldPlay = false) {
        currentTrackIndex = index;
        const track = playlist[index];
        
        // Update player header labels
        trackName.textContent = track.title;
        const artistEl = document.querySelector('.track-artist');
        if (artistEl) artistEl.textContent = track.artist;
        totalDurationEl.textContent = track.duration;
        
        // Reset slider positions
        progressBar.style.width = '0%';
        progressKnob.style.left = '0%';
        currentTimeEl.textContent = '0:00';
        
        // Highlight active track in Playlist Drawer
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, idx) => {
            if (idx === index) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
        
        // Failsafe Loading Mechanism
        audio.src = track.src;
        audio.load();
        
        let redirectedToFallback = false;
        
        // Handle missing local file error once
        const handleAudioError = () => {
            if (!redirectedToFallback) {
                console.log(`Local song ${track.src} not loaded. Directing to stream: ${track.fallback}`);
                audio.src = track.fallback;
                audio.load();
                if (shouldPlay) playAudio();
                redirectedToFallback = true;
            }
        };
        
        audio.addEventListener('error', handleAudioError, { once: true });
        
        audio.addEventListener('canplay', () => {
            audio.removeEventListener('error', handleAudioError);
            if (shouldPlay) playAudio();
        }, { once: true });
    }

    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
            albumCover.classList.add('playing');
            visualizer.classList.add('playing');
        }).catch(err => {
            console.log("Autoplay standby.", err);
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        albumCover.classList.remove('playing');
        visualizer.classList.remove('playing');
    }

    function togglePlay() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    function playNext() {
        if (shuffleBtn.classList.contains('active')) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * playlist.length);
            } while (randomIndex === currentTrackIndex && playlist.length > 1);
            loadTrack(randomIndex, true);
        } else {
            const nextIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(nextIndex, true);
        }
    }

    function playPrev() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            playAudio();
        } else {
            const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(prevIndex, true);
        }
    }

    // Attach control listeners
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', playNext);
    if (prevBtn) prevBtn.addEventListener('click', playPrev);

    audio.addEventListener('loadedmetadata', () => {
        totalDurationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            progressKnob.style.left = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            playAudio();
        } else {
            playNext();
        }
    });

    function formatTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${formattedSeconds}`;
    }

    if (progressBarContainer) {
        progressBarContainer.addEventListener('click', (e) => {
            const containerWidth = progressBarContainer.clientWidth;
            const clickPositionX = e.offsetX;
            
            if (audio.duration) {
                const newTime = (clickPositionX / containerWidth) * audio.duration;
                audio.currentTime = newTime;
                
                const progressPercent = (newTime / audio.duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
                progressKnob.style.left = `${progressPercent}%`;
            }
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            shuffleBtn.classList.toggle('active');
            if (shuffleBtn.classList.contains('active')) {
                showFloatingAlert("🔀 Mode acak aktif, tapi cintaku tetap satu!");
            }
        });
    }

    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            isRepeat = !isRepeat;
            repeatBtn.classList.toggle('active');
            if (isRepeat) {
                showFloatingAlert("🔂 Lagu ini diputar ulang, sama seperti cintaku padamu.");
            }
        });
    }

    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            audio.muted = isMuted;
            if (isMuted) {
                volumeOnIcon.style.display = 'none';
                volumeMuteIcon.style.display = 'inline';
                volumeSliderFill.style.width = '0%';
            } else {
                volumeOnIcon.style.display = 'inline';
                volumeMuteIcon.style.display = 'none';
                volumeSliderFill.style.width = `${currentVolume * 100}%`;
            }
        });
    }

    if (volumeSliderBg) {
        volumeSliderBg.addEventListener('click', (e) => {
            const trackWidth = volumeSliderBg.clientWidth;
            const clickX = e.offsetX;
            const newVolume = Math.min(Math.max(clickX / trackWidth, 0), 1);
            
            currentVolume = newVolume;
            audio.volume = newVolume;
            audio.muted = false;
            
            isMuted = false;
            volumeOnIcon.style.display = 'inline';
            volumeMuteIcon.style.display = 'none';
            volumeSliderFill.style.width = `${newVolume * 100}%`;
        });
    }

    // Attach click triggers on Playlist Drawer (handles jumping tracks)
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (item) {
            const index = parseInt(item.dataset.index);
            loadTrack(index, true);
            showFloatingAlert(`Memutar lagu: ${playlist[index].title} 🎵`);
        }
    });

    // Initialize track 1 on load without autoplaying
    loadTrack(0, false);


    // --- TRIPLE FAILSAFE MEDIA LOADER ---
    // Initiates checkers for each polaroid card to handle MP4 -> JPG -> CSS templates.
    function initCardMedia(card) {
        const video = card.querySelector('.polaroid-video');
        const img = card.querySelector('.polaroid-img');
        const fallback = card.querySelector('.photo-fallback');
        const badge = card.querySelector('.video-badge');

        if (!video || !img || !fallback) return;

        // Try Loading Video
        video.addEventListener('canplay', () => {
            video.style.display = 'block';
            img.style.display = 'none';
            fallback.style.display = 'none';
            if (badge) badge.style.display = 'flex';
            card.dataset.mediaLoaded = 'video';
        });

        video.addEventListener('error', () => {
            // Video failed to load (or is missing) -> Try Image
            video.style.display = 'none';
            if (badge) badge.style.display = 'none';
            
            // Image trigger
            img.style.display = 'block';
            
            img.onload = () => {
                fallback.style.display = 'none';
                card.dataset.mediaLoaded = 'image';
            };
            
            img.onerror = () => {
                // Both video & image failed -> display CSS fallback card
                img.style.display = 'none';
                fallback.style.display = 'flex';
                card.dataset.mediaLoaded = 'fallback';
            };
            
            // Force reload image just in case
            const currentSrc = img.src;
            img.src = currentSrc;
        });

        // Trigger video load check
        video.load();
    }

    // Initialize checkers on all original polaroids
    const originalCards = document.querySelectorAll('.marquee-track .polaroid-card');
    originalCards.forEach(card => initCardMedia(card));


    // --- POLAROID MARQUEE SEAMLESS LOOP CLONING ---
    const marqueeTrack1 = document.getElementById('marqueeTrack1');
    if (marqueeTrack1) {
        const cardsToClone = Array.from(marqueeTrack1.children);
        cardsToClone.forEach(card => {
            const clone = card.cloneNode(true);
            
            // Reinitialize checks on the cloned card elements
            initCardMedia(clone);
            
            marqueeTrack1.appendChild(clone);
        });
    }


    // --- ROMANTIC POLAROID LIGHTBOX MODAL ---
    let mainTrackVolumeBeforeDucking = currentVolume;

    function openLightbox(card) {
        if (!photoLightbox) return;
        
        const index = card.dataset.index;
        const caption = card.dataset.caption;
        const desc = card.dataset.desc;
        const mediaType = card.dataset.mediaLoaded || 'fallback';

        // Set titles and custom captions
        lightboxTitle.textContent = caption;
        lightboxDescription.textContent = desc;

        // Clear previous modal items
        lightboxMediaContainer.innerHTML = '';

        // Inject active media type
        if (mediaType === 'video') {
            // Inject unmuted looping video with standard controls
            const videoElem = document.createElement('video');
            videoElem.src = `images/video${index}.mp4`;
            videoElem.controls = true;
            videoElem.autoplay = true;
            videoElem.loop = true;
            videoElem.playsInline = true;
            videoElem.className = 'lightbox-media-content';
            lightboxMediaContainer.appendChild(videoElem);

            // AUDIO DUCKING UX: Fade main background track down so she can hear the video!
            mainTrackVolumeBeforeDucking = currentVolume;
            fadeBackgroundAudio(0.15, 600);
            
        } else if (mediaType === 'image') {
            // Inject Polaroid image
            const imgElem = document.createElement('img');
            imgElem.src = `images/photo${index}.jpg`;
            imgElem.alt = caption;
            imgElem.className = 'lightbox-media-content';
            lightboxMediaContainer.appendChild(imgElem);
            
        } else {
            // Inject beautiful fallback SVG gradients
            const fallbackElem = card.querySelector('.photo-fallback').cloneNode(true);
            fallbackElem.style.position = 'absolute';
            fallbackElem.style.width = '100%';
            fallbackElem.style.height = '100%';
            lightboxMediaContainer.appendChild(fallbackElem);
        }

        // Display Lightbox Modal
        photoLightbox.classList.add('active');
        photoLightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        if (!photoLightbox) return;

        // Fade out lightbox modal
        photoLightbox.classList.remove('active');
        photoLightbox.setAttribute('aria-hidden', 'true');

        // Restore main track volume level
        fadeBackgroundAudio(mainTrackVolumeBeforeDucking, 600);

        // Standard delay (wait for transition) before clearing elements to stop playback
        setTimeout(() => {
            lightboxMediaContainer.innerHTML = '';
        }, 500);
    }

    // Audio volume fader helper
    function fadeBackgroundAudio(targetVolume, durationMs) {
        if (!audio) return;
        const steps = 15;
        const stepTime = durationMs / steps;
        const volDifference = targetVolume - audio.volume;
        const volStep = volDifference / steps;
        
        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            if (currentStep >= steps) {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
            } else {
                audio.volume = Math.min(Math.max(audio.volume + volStep, 0), 1);
                currentStep++;
            }
        }, stepTime);
    }

    // Event delegation on card clicks (handles cloned marquee cards perfectly!)
    document.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.polaroid-card');
        if (clickedCard) {
            openLightbox(clickedCard);
        }
    });

    // Close listeners
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    // Close when tapping outside the modal frame card
    photoLightbox.addEventListener('click', (e) => {
        if (!e.target.closest('.lightbox-content') && !e.target.closest('.close-lightbox')) {
            closeLightbox();
        }
    });

    // Close when tapping Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoLightbox.classList.contains('active')) {
            closeLightbox();
        }
    });


    // --- SCROLL INTERSECTION REVEALS ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 10) * 8.5;
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();


    // --- FLOATING CONFESSION ALERTS ---
    function showFloatingAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.className = 'romantic-alert';
        alertBox.textContent = message;
        
        Object.assign(alertBox.style, {
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%) translateY(-20px)',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            padding: '12px 24px',
            borderRadius: '50px',
            boxShadow: '0 10px 25px rgba(255, 107, 139, 0.2)',
            zIndex: '9999',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--text-dark)',
            textAlign: 'center',
            opacity: '0',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
        });

        document.body.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.style.opacity = '1';
            alertBox.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => alertBox.remove(), 400);
        }, 3200);
    }
});
