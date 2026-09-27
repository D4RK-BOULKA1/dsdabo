/**
 * ==========================================================================
 * ÉCOLE PRIVÉE MODERNE DS DABO - SCRIPT JAVASCRIPT OFFICIEL
 * Interactivité complète, carrousel 8 diapositives, vidéos prodiges,
 * FAQ accordéon, modal WhatsApp et animations d'apparition fluides.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constantes globales
  const WHATSAPP_PHONE = '22378045050'; // Numéro officiel DS DABO
  const SLIDE_DURATION = 5000; // 5 secondes par diapositive

  /* ------------------------------------------------------------------------
     1. ÉCRAN DE CHARGEMENT ANIMÉ (PRELOADER)
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  
  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }
  };

  // Masquer le preloader une fois la page entièrement chargée ou après 1.8s
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1800);

  /* ------------------------------------------------------------------------
     2. GESTION DU HEADER STICKY & SCROLL TO TOP
     ------------------------------------------------------------------------ */
  const mainHeader = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header sticky shadow
    if (mainHeader) {
      if (scrollPos > 30) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Bouton de remontée en haut
    if (scrollTopBtn) {
      if (scrollPos > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. TIROIR DE NAVIGATION MOBILE & MENU BURGER
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('open');
      drawerOverlay.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('open');
      drawerOverlay.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ------------------------------------------------------------------------
     4. LIENS ACTIFS DE NAVIGATION (SCROLLSPY)
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ------------------------------------------------------------------------
     5. CARROUSEL HAUTE PERFORMANCE (SLIDES 1 À 8)
     ------------------------------------------------------------------------ */
  const slides = document.querySelectorAll('.slide-item');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  const sliderDotsContainer = document.getElementById('sliderDots');
  const sliderProgressBar = document.getElementById('sliderProgressBar');
  const sliderTrack = document.getElementById('sliderTrack');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideTimer = null;
  let progressInterval = null;
  let progressStartTime = 0;

  // Création dynamique des puces (dots) pour les 8 slides
  if (sliderDotsContainer && totalSlides > 0) {
    sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Aller à la diapositive ${i + 1}`);
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoPlay();
      });
      sliderDotsContainer.appendChild(dot);
    }
  }

  const updateDots = (index) => {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToSlide = (index) => {
    if (totalSlides === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');

    updateDots(currentSlide);
    resetProgressBar();
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  if (sliderNext) {
    sliderNext.addEventListener('click', () => {
      nextSlide();
      restartAutoPlay();
    });
  }

  if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
      prevSlide();
      restartAutoPlay();
    });
  }

  // Animation de la barre de progression
  const startProgressBar = () => {
    if (!sliderProgressBar) return;
    sliderProgressBar.style.width = '0%';
    progressStartTime = Date.now();

    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStartTime;
      const percentage = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      sliderProgressBar.style.width = `${percentage}%`;

      if (percentage >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);
  };

  const resetProgressBar = () => {
    clearInterval(progressInterval);
    startProgressBar();
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    startProgressBar();
    slideTimer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
  };

  const stopAutoPlay = () => {
    if (slideTimer) clearInterval(slideTimer);
    if (progressInterval) clearInterval(progressInterval);
  };

  const restartAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Pause au survol du slider
  if (sliderTrack) {
    sliderTrack.addEventListener('mouseenter', stopAutoPlay);
    sliderTrack.addEventListener('mouseleave', startAutoPlay);

    // Support Swipe tactile pour mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          nextSlide(); // Balayage vers la gauche -> suivant
        } else {
          prevSlide(); // Balayage vers la droite -> précédent
        }
      }
    };
  }

  // Lancement initial du carrousel
  if (totalSlides > 0) {
    startAutoPlay();
  }

  /* ------------------------------------------------------------------------
     6. COMPTEUR DE STATISTIQUES ANIMÉ
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const runCounterAnimation = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 secondes
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const counterInterval = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          stat.textContent = target.toLocaleString('fr-FR');
          clearInterval(counterInterval);
        } else {
          stat.textContent = Math.floor(currentVal).toLocaleString('fr-FR');
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          runCounterAnimation();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------------
     7. ANIMATION D'APPARITION AU SCROLL (SCROLL REVEAL)
     ------------------------------------------------------------------------ */
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback pour anciens navigateurs
    reveals.forEach(el => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     8. SECTION "NOS PRODIGES" (GESTION DES VIDÉOS LOCALES)
     ------------------------------------------------------------------------ */
  const prodigeVideos = document.querySelectorAll('.prodige-video');
  const videoPlayBtns = document.querySelectorAll('.video-play-btn');
  const videoToggleBtns = document.querySelectorAll('.video-toggle-btn');

  const toggleVideoPlayback = (videoId) => {
    const video = document.getElementById(videoId);
    if (!video) return;

    const playBtn = document.querySelector(`.video-play-btn[data-video="${videoId}"]`);
    const toggleBtn = document.querySelector(`.video-toggle-btn[data-video="${videoId}"]`);

    if (video.paused) {
      // Mettre en pause toutes les autres vidéos d'abord
      prodigeVideos.forEach(v => {
        if (v !== video) {
          v.pause();
          const otherPlayBtn = document.querySelector(`.video-play-btn[data-video="${v.id}"]`);
          if (otherPlayBtn) otherPlayBtn.classList.remove('playing');
        }
      });

      video.play().then(() => {
        video.controls = true;
        if (playBtn) playBtn.classList.add('playing');
        if (toggleBtn) toggleBtn.querySelector('span').textContent = 'Mettre en pause';
      }).catch(err => {
        console.warn('Lecture vidéo restreinte par le navigateur :', err);
      });
    } else {
      video.pause();
      if (playBtn) playBtn.classList.remove('playing');
      if (toggleBtn) toggleBtn.querySelector('span').textContent = 'Visionner la vidéo';
    }
  };

  videoPlayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.getAttribute('data-video');
      toggleVideoPlayback(videoId);
    });
  });

  videoToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.getAttribute('data-video');
      toggleVideoPlayback(videoId);
    });
  });

  prodigeVideos.forEach(video => {
    video.addEventListener('ended', () => {
      const playBtn = document.querySelector(`.video-play-btn[data-video="${video.id}"]`);
      const toggleBtn = document.querySelector(`.video-toggle-btn[data-video="${video.id}"]`);
      if (playBtn) playBtn.classList.remove('playing');
      if (toggleBtn) toggleBtn.querySelector('span').textContent = 'Revoir la vidéo';
      video.controls = false;
    });

    video.addEventListener('pause', () => {
      const playBtn = document.querySelector(`.video-play-btn[data-video="${video.id}"]`);
      if (playBtn) playBtn.classList.remove('playing');
    });

    video.addEventListener('play', () => {
      const playBtn = document.querySelector(`.video-play-btn[data-video="${video.id}"]`);
      if (playBtn) playBtn.classList.add('playing');
    });
  });

  /* ------------------------------------------------------------------------
     9. FOIRE AUX QUESTIONS (FAQ INTERACTIVE ACCORDÉON)
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (questionBtn && answerEl) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Fermer les autres items pour un affichage propre
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Basculer l'item courant
        if (isOpen) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answerEl.style.maxHeight = null;
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
        }
      });
    }
  });

  /* ------------------------------------------------------------------------
     10. POP-UP MODAL WHATSAPP INTERACTIF
     ------------------------------------------------------------------------ */
  const whatsappModal = document.getElementById('whatsappModal');
  const modalClose = document.getElementById('modalClose');
  const openModalButtons = document.querySelectorAll('.open-whatsapp-modal');
  const whatsappForm = document.getElementById('whatsappForm');
  const whatsappMessageInput = document.getElementById('whatsappMessageInput');
  const topicChips = document.querySelectorAll('.topic-chip');

  const openWhatsAppModal = (customSubject = '') => {
    if (!whatsappModal) return;

    if (customSubject && whatsappMessageInput) {
      whatsappMessageInput.value = `Bonjour, je prends contact avec l'École DS DABO concernant : ${customSubject}. Pouvez-vous me renseigner ?`;
      
      // Désactiver la sélection des puces prédéfinies
      topicChips.forEach(chip => chip.classList.remove('active'));
    }

    if (typeof whatsappModal.showModal === 'function') {
      whatsappModal.showModal();
    } else {
      // Fallback
      whatsappModal.setAttribute('open', '');
    }
  };

  const closeWhatsAppModal = () => {
    if (!whatsappModal) return;
    if (typeof whatsappModal.close === 'function') {
      whatsappModal.close();
    } else {
      whatsappModal.removeAttribute('open');
    }
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = btn.getAttribute('data-subject') || '';
      openWhatsAppModal(subject);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeWhatsAppModal);
  }

  // Fermer le modal en cliquant sur le fond (backdrop)
  if (whatsappModal) {
    whatsappModal.addEventListener('click', (e) => {
      const rect = whatsappModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeWhatsAppModal();
      }
    });
  }

  // Puces de sujets prédéfinis
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      topicChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const presetMsg = chip.getAttribute('data-msg');
      if (whatsappMessageInput && presetMsg) {
        whatsappMessageInput.value = presetMsg;
        whatsappMessageInput.focus();
      }
    });
  });

  // Soumission du formulaire WhatsApp
  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = whatsappMessageInput ? whatsappMessageInput.value.trim() : '';

      const fallbackMsg = "Bonjour, je souhaite avoir des informations sur l'École DS DABO.";
      const finalMessage = messageText.length > 0 ? messageText : fallbackMsg;

      // Construction de l'URL WhatsApp avec le numéro malien officiel
      const encodedMsg = encodeURIComponent(finalMessage);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;

      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Fermer le modal
      closeWhatsAppModal();
    });
  }

});
