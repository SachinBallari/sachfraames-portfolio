/**
 * SACHFRAMES - PORTFOLIO INTERACTION LOGIC
 * Cinematic smooth transitions, project video overlay player, scroll reveals
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Cinematic Page Entry Transition ---
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Slide out the overlay on load
        setTimeout(() => {
            overlay.style.transform = 'scaleY(0)';
        }, 100);
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.site-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            siteNav.classList.toggle('open');
            // Toggle body scroll to prevent double scrollbars
            document.body.style.overflow = siteNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                siteNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Intersection Observer for Scroll Reveals & Active Links ---
    const revealSections = document.querySelectorAll('.reveal-section');
    
    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can unobserve if we want a one-shot reveal
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // Active Link Highlighting based on scroll
    const sections = document.querySelectorAll('section');
    const navObserverOptions = {
        threshold: 0.5,
        rootMargin: '-80px 0px -50% 0px' // adjust for header offset
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- Project Database & Modals ---
    const projects = {
        storytelling: {
            title: "PHOTOGRAPHY",
            description: "High-Contrast &bull; Editorial Stills Portfolio",
            credits: "Photographer: Sachin S Ballari | Camera: Leica SL2",
            videoSrc: "assets/AllDOORS!-2.mp4"
        },
        selfedit: {
            title: "SHORT FILMS",
            description: "Director &bull; Narrative Short Film Collection",
            credits: "Director & Editor: Sachin S Ballari | Sound Design: Arul M.",
            videoSrc: "assets/Kudaka BTS.mp4"
        },
        alldoors: {
            title: "BEHIND THE SCENE",
            description: "Cinematography &bull; Behind the Scenes Production Footage",
            credits: "DOP & Editor: Sachin S Ballari | Client: Independent Cinema",
            videoSrc: "assets/AllDOORS!-2.mp4"
        },
        events: {
            title: "EVENTS",
            description: "Cinematic Event Coverage &bull; Multi-Cam Coverage",
            credits: "Lead Editor & Camera A: Sachin S Ballari | Client: Live Festivals",
            videoSrc: "assets/event(1).mp4",
            playlist: ["assets/event(1).mp4", "assets/event(2).mp4"]
        },
        editor: {
            title: "EDITOR",
            description: "Post-Production &bull; Color Grading Showreel",
            credits: "Editor & Colorist: Sachin S Ballari | Client: Nomad Expeditions",
            videoSrc: "assets/Editor.mp4"
        }
    };

    const videoModal = document.getElementById('video-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalPlayer = document.getElementById('modal-player');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const placeholder = document.getElementById('modal-video-placeholder');
    const projectCards = document.querySelectorAll('.project-card');

    const openModal = (projectId) => {
        const project = projects[projectId];
        if (!project) return;

        // Set metadata
        modalDesc.innerHTML = `${project.description}<br><small style="color: #666; font-size: 0.8rem; margin-top: 5px; display: inline-block;">${project.credits}</small>`;
        modalTitle.textContent = project.title;
        
        // Reset player state
        modalPlayer.style.display = 'none';
        placeholder.style.opacity = '1';
        placeholder.style.display = 'flex';

        // Load project video source
        const sourceElement = modalPlayer.querySelector('source');
        
        // Check if playlist exists
        if (project.playlist && project.playlist.length > 0) {
            sourceElement.src = project.playlist[0];
            
            // Build playlist switcher buttons
            const btnContainer = document.createElement('div');
            btnContainer.className = 'modal-playlist-buttons';
            project.playlist.forEach((src, idx) => {
                const btn = document.createElement('button');
                btn.className = `playlist-btn${idx === 0 ? ' active' : ''}`;
                btn.textContent = `CLIP 0${idx + 1}`;
                btn.addEventListener('click', () => {
                    // Update active class
                    btnContainer.querySelectorAll('.playlist-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Switch video source
                    modalPlayer.pause();
                    modalPlayer.style.display = 'none';
                    placeholder.style.opacity = '1';
                    placeholder.style.display = 'flex';
                    
                    sourceElement.src = src;
                    modalPlayer.load();
                    modalPlayer.play()
                        .then(() => {
                            setTimeout(() => {
                                placeholder.style.opacity = '0';
                                setTimeout(() => {
                                    placeholder.style.display = 'none';
                                }, 500);
                                modalPlayer.style.display = 'block';
                            }, 800);
                        })
                        .catch(err => console.log("Failed playing playlist clip:", err));
                });
                btnContainer.appendChild(btn);
            });
            modalDesc.appendChild(btnContainer);
        } else {
            sourceElement.src = project.videoSrc;
        }
        
        // Show modal
        videoModal.style.display = 'flex';
        setTimeout(() => {
            videoModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        }, 50);

        // Attempt playback
        modalPlayer.load();
        modalPlayer.play()
            .then(() => {
                // Successfully playing, hide placeholder
                setTimeout(() => {
                    placeholder.style.opacity = '0';
                    setTimeout(() => {
                        placeholder.style.display = 'none';
                    }, 500);
                    modalPlayer.style.display = 'block';
                }, 1200); // Cinematic transition delay
            })
            .catch(err => {
                console.log("Auto-playback deferred. Displaying fallback interaction model.", err);
            });
    };

    const closeModal = () => {
        modalPlayer.pause();
        videoModal.classList.remove('open');
        setTimeout(() => {
            videoModal.style.display = 'none';
            document.body.style.overflow = ''; // Unlock scroll
        }, 500);
    };

    // Attach click events to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-project-id');
            openModal(id);
        });
    });

    // Showreel Play Trigger
    const showreelTrigger = document.getElementById('showreel-trigger');
    if (showreelTrigger) {
        showreelTrigger.addEventListener('click', () => {
            openModal('editor'); // Show editor showreel clip on click
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on clicking outside content
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }

    // --- Start Project Button Action ---
    const startProjectBtn = document.getElementById('start-project-btn');
    const nameInput = document.getElementById('form-name');
    if (startProjectBtn && nameInput) {
        startProjectBtn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                nameInput.focus();
            }, 800);
        });
    }

    // --- Contact Form Submission handling ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple fade-out animation on the form
            contactForm.style.transition = 'opacity 0.4s ease';
            contactForm.style.opacity = '0';

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'flex';
            }, 400);

            // Mock Submission data
            const submissionData = {
                name: document.getElementById('form-name').value,
                email: document.getElementById('form-email').value,
                service: document.getElementById('form-service').value,
                message: document.getElementById('form-message').value
            };
            
            console.log("Cinematic Lead Received: ", submissionData);
        });
    }
    
    // --- Smooth Back to Top Scroll ---
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
