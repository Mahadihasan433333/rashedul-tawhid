/* ==========================================================================
   CINEMATOGRAPHER PORTFOLIO JAVASCRIPT LOGIC — RASHEDUL TAWHID
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Header Scroll Effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Aspect Ratio Switcher ---
  const ratioButtons = document.querySelectorAll('.ratio-btn');
  const body = document.body;
  const ratioText = document.getElementById('currentRatioText');

  ratioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      body.classList.remove('ratio-anamorphic', 'ratio-standard', 'ratio-vintage');
      ratioButtons.forEach(b => b.classList.remove('active'));

      const ratio = btn.getAttribute('data-ratio');
      btn.classList.add('active');

      if (ratio === 'anamorphic') {
        body.classList.add('ratio-anamorphic');
        if (ratioText) ratioText.textContent = '2.39:1 ANAMORPHIC';
      } else if (ratio === 'vintage') {
        body.classList.add('ratio-vintage');
        if (ratioText) ratioText.textContent = '4:3 VINTAGE ACADEMY';
      } else {
        body.classList.add('ratio-standard');
        if (ratioText) ratioText.textContent = '16:9 STANDARD CINEMA';
      }
    });
  });

  // --- 3. Mobile Navigation Drawer ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => mobileDrawer.classList.add('active'));
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('active'));
  }

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => mobileDrawer.classList.remove('active'));
  });

  // --- 4. Video Embed & Native HTML5 Lightbox Manager ---
  const playReelBtn = document.getElementById('playReelBtn');
  const videoModal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const nativeVideoPlayer = document.getElementById('nativeVideoPlayer');
  const videoSource = document.getElementById('videoSource');
  const videoIframe = document.getElementById('videoIframe');
  const fallbackPoster = document.getElementById('fallbackPoster');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalSpecs = document.getElementById('videoModalSpecs');

  function formatEmbedUrl(url) {
    if (!url) return null;

    if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) {
      const cleanUrl = url.trim();
      const encodedUrl = encodeURIComponent(cleanUrl);
      return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&autoplay=true`;
    }
    else if (url.includes('instagram.com')) {
      let cleanUrl = url.split('?')[0];
      if (!cleanUrl.endsWith('/')) cleanUrl += '/';
      return cleanUrl + 'embed/captioned/';
    } 
    else if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&autopause=0`;
      }
    } 
    else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`;
      }
    }

    return null;
  }

  function loadAndPlayVideo(target, title, specs) {
    if (title && videoModalTitle) videoModalTitle.textContent = title;
    if (specs && videoModalSpecs) videoModalSpecs.textContent = specs;

    const inputVal = target ? target.trim() : '';

    // Check if input is a local video file (.mp4, .webm, videos/...)
    if (inputVal.endsWith('.mp4') || inputVal.endsWith('.webm') || inputVal.startsWith('videos/')) {
      if (nativeVideoPlayer && videoSource) {
        videoSource.src = inputVal;
        nativeVideoPlayer.load();
        nativeVideoPlayer.style.display = 'block';
        nativeVideoPlayer.play().catch(() => {});
      }
      if (videoIframe) { videoIframe.src = ''; videoIframe.style.display = 'none'; }
      if (fallbackPoster) fallbackPoster.style.display = 'none';
    } 
    // Otherwise check for online embed links (YouTube / Vimeo / Facebook / Instagram)
    else {
      const embedUrl = formatEmbedUrl(inputVal);
      if (nativeVideoPlayer) { nativeVideoPlayer.pause(); nativeVideoPlayer.style.display = 'none'; }

      if (embedUrl && videoIframe) {
        videoIframe.src = embedUrl;
        videoIframe.style.display = 'block';
        if (fallbackPoster) fallbackPoster.style.display = 'none';
      } else {
        if (videoIframe) { videoIframe.src = ''; videoIframe.style.display = 'none'; }
        if (fallbackPoster) fallbackPoster.style.display = 'block';
      }
    }

    if (videoModal) videoModal.classList.add('active');
  }

  if (playReelBtn) {
    playReelBtn.addEventListener('click', () => {
      const url = playReelBtn.getAttribute('data-video') || 'videos/showreel.mp4';
      loadAndPlayVideo(url, 'Rashedul Tawhid — Cinematography Showreel 2026', 'Shot on ARRI Alexa 35 & RED V-Raptor XL');
    });
  }

  if (modalClose && videoModal) {
    modalClose.addEventListener('click', () => {
      videoModal.classList.remove('active');
      if (nativeVideoPlayer) nativeVideoPlayer.pause();
      if (videoIframe) videoIframe.src = '';
    });
  }

  document.querySelectorAll('.play-project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const customUrl = btn.getAttribute('data-url') || 'videos/showreel.mp4';
      loadAndPlayVideo(customUrl, title, 'Featured Portfolio Selection');
    });
  });

  // --- 5. Interactive Color LUT Before/After Slider ---
  const lutContainer = document.getElementById('lutSliderContainer');
  const lutAfterImage = document.getElementById('lutAfterImage');
  const lutHandle = document.getElementById('lutHandle');

  if (lutContainer && lutAfterImage && lutHandle) {
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = lutContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      lutAfterImage.style.width = `${percentage}%`;
      lutHandle.style.left = `${percentage}%`;
    };

    lutHandle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    lutHandle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
    });
  }

  // --- 6. Category Filter for Projects ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 7. Lighting & Frame Simulator Controls ---
  const simButtons = document.querySelectorAll('.sim-btn');
  const simFilter = document.getElementById('simFilter');
  const readoutKelvin = document.getElementById('readoutKelvin');
  const readoutGrain = document.getElementById('readoutGrain');
  const filmGrain = document.getElementById('filmGrain');

  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentGroup = btn.closest('.control-group');
      parentGroup.querySelectorAll('.sim-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const kelvin = btn.getAttribute('data-kelvin');
      if (kelvin) {
        simFilter.className = 'sim-color-filter';
        if (kelvin === '3200') simFilter.classList.add('filter-3200k');
        else if (kelvin === '7500') simFilter.classList.add('filter-7500k');
        else if (kelvin === 'cyan') simFilter.classList.add('filter-cyan');
        else simFilter.classList.add('filter-5600k');

        if (readoutKelvin) readoutKelvin.textContent = `COLOR TEMP: ${btn.getAttribute('data-label')}`;
      }

      const grain = btn.getAttribute('data-grain');
      if (grain) {
        if (grain === 'fine') {
          filmGrain.style.opacity = '0.35';
        } else if (grain === 'coarse') {
          filmGrain.style.opacity = '0.7';
        } else {
          filmGrain.style.opacity = '0';
        }
        if (readoutGrain) readoutGrain.textContent = `GRAIN: ${btn.getAttribute('data-grainlabel')}`;
      }
    });
  });
});
