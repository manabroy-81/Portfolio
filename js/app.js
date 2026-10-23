

document.addEventListener("DOMContentLoaded", () => {
  if (typeof portfolioData === "undefined") {
    console.error("portfolioData is missing! Make sure portfolio-data.js is loaded.");
    return;
  }

  // Initialize Portfolio Components
  renderHeroAndPersonal(portfolioData);
  renderStats(portfolioData.personal.stats);
  renderAcademicProjects(portfolioData.academicProjects);
  initProjectFiltersAndSearch(portfolioData.academicProjects);
  renderSkills(portfolioData.skills);
  renderEducation(portfolioData.education);
  renderResumeBanner(portfolioData.resume);
  renderContact(portfolioData);
  initModals();
  initNavigation();
  initScrollWatchers();
});

/* ====================================================================
   HERO & PERSONAL INFO RENDERING
   ==================================================================== */
function renderHeroAndPersonal(data) {
  const p = data.personal;
  const s = data.socialLinks;

  const heroBadge = document.getElementById("hero-badge");
  const heroName = document.getElementById("hero-name");
  const heroTitle = document.getElementById("hero-title");
  const heroBio = document.getElementById("hero-bio");
  const navBrandName = document.getElementById("nav-brand-name");
  const heroAvatar = document.getElementById("hero-avatar");

  if (heroBadge) heroBadge.textContent = p.badge || "Available for Opportunities";
  if (heroName) heroName.textContent = p.name || "Your Name";
  if (heroTitle) heroTitle.textContent = p.title || "Software Engineer & Scholar";
  if (heroBio) heroBio.textContent = p.bio || "Add your bio here...";
  if (navBrandName) navBrandName.textContent = p.name ? p.name.split(" ")[0] : "Portfolio";
  if (heroAvatar && p.avatar) heroAvatar.src = p.avatar;

  // Social Links in Hero
  const heroSocialWrap = document.getElementById("hero-social-links");
  if (heroSocialWrap) {
    let linksHtml = "";
    if (s.linkedin) {
      linksHtml += `
        <a href="${s.linkedin}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="LinkedIn Profile" aria-label="LinkedIn">
          <i class="fab fa-linkedin-in"></i>
        </a>
      `;
    }
    if (s.github) {
      linksHtml += `
        <a href="${s.github}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="GitHub Profile" aria-label="GitHub">
          <i class="fab fa-github"></i>
        </a>
      `;
    }
    if (p.email) {
      linksHtml += `
        <a href="mailto:${p.email}" class="social-icon-btn" title="Send Email" aria-label="Email">
          <i class="fas fa-envelope"></i>
        </a>
      `;
    }
    if (s.twitter) {
      linksHtml += `
        <a href="${s.twitter}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="Twitter/X Profile" aria-label="Twitter">
          <i class="fab fa-x-twitter"></i>
        </a>
      `;
    }
    heroSocialWrap.innerHTML = linksHtml;
  }

  // Resume Download Buttons
  const downloadBtns = document.querySelectorAll(".btn-download-resume");
  downloadBtns.forEach(btn => {
    btn.setAttribute("href", data.resume.pdfPath || "assets/resume.pdf");
    btn.setAttribute("download", data.resume.filename || "Resume.pdf");
  });
}

/* ====================================================================
   STATS BAR RENDERING
   ==================================================================== */
function renderStats(stats) {
  const container = document.getElementById("stats-container");
  if (!container) return;

  if (!stats || stats.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
        Log in via Owner Access to auto-populate your stats!
      </div>
    `;
    return;
  }

  container.innerHTML = stats.map(stat => `
    <div class="stat-item">
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `).join("");
}

/* ====================================================================
   ACADEMIC PROJECTS RENDERING & FILTERING
   ==================================================================== */
let currentCategory = "all";
let currentSearch = "";

function renderAcademicProjects(projects) {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
        <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--accent-terracotta); margin-bottom: 1rem; opacity: 0.8;"></i>
        <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">No Academic Projects Added Yet</h3>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto;">
          The owner can log in through the footer "Owner Access" link to import projects.
        </p>
      </div>
    `;
    return;
  }

  // Filter based on category and search query
  const filtered = projects.filter(item => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const q = currentSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.course && item.course.toLowerCase().includes(q)) ||
      (item.shortDesc && item.shortDesc.toLowerCase().includes(q)) ||
      (item.techStack && item.techStack.some(t => t.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--text-secondary);">
        <i class="fas fa-search" style="font-size: 2.2rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="color: var(--text-primary); margin-bottom: 0.25rem;">No projects matched your search</h3>
        <p>Try searching for a different keyword or resetting filters.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="resetProjectFilters()">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(proj => `
    <article class="project-card" data-id="${proj.id}">
      <div class="project-card-image-wrap">
        <img src="${proj.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'}" 
             alt="${proj.title}" 
             class="project-card-image" 
             loading="lazy">
        ${proj.featured ? `<div class="project-featured-badge"><i class="fas fa-star"></i> Featured</div>` : ''}
      </div>

      <div class="project-card-body">
        <div class="project-meta-row">
          <span class="badge badge-course">${proj.badge || 'Academic Project'}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">
            <i class="far fa-calendar-alt"></i> ${proj.term || 'Academic Term'}
          </span>
        </div>

        <h3 class="project-card-title">${proj.title}</h3>
        
        ${proj.course ? `
          <div class="project-card-course">
            <i class="fas fa-graduation-cap"></i> ${proj.course}
          </div>
        ` : ''}

        <p class="project-card-desc">${proj.shortDesc || ''}</p>

        <div class="project-tech-tags">
          ${(proj.techStack || []).map(t => `<span class="tech-tag-chip">${t}</span>`).join("")}
        </div>

        <div class="project-card-footer">
          <button class="btn btn-outline btn-sm" onclick="openProjectModal('${proj.id}')">
            <i class="fas fa-info-circle"></i> Details
          </button>
          
          <div class="project-action-links">
            ${proj.githubUrl ? `
              <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Source Code on GitHub">
                <i class="fab fa-github"></i> Code
              </a>
            ` : ''}
            ${proj.demoUrl ? `
              <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="Live Preview">
                <i class="fas fa-external-link-alt"></i> Demo
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function initProjectFiltersAndSearch(projects) {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("project-search-input");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderAcademicProjects(window.portfolioData.academicProjects);
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderAcademicProjects(window.portfolioData.academicProjects);
    });
  }
}

window.resetProjectFilters = function() {
  currentCategory = "all";
  currentSearch = "";
  const searchInput = document.getElementById("project-search-input");
  if (searchInput) searchInput.value = "";
  
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === "all");
  });
  renderAcademicProjects(window.portfolioData.academicProjects);
};

/* ====================================================================
   SKILLS & COMPETENCIES RENDERING
   ==================================================================== */
function renderSkills(skillsCategories) {
  const container = document.getElementById("skills-grid");
  if (!container) return;

  if (!skillsCategories || skillsCategories.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
        No skills added yet.
      </div>
    `;
    return;
  }

  const iconMap = {
    "code": "fa-code",
    "layers": "fa-layer-group",
    "book-open": "fa-graduation-cap",
    "wrench": "fa-tools"
  };

  container.innerHTML = skillsCategories.map(cat => `
    <div class="skills-category-card">
      <div class="skills-category-header">
        <div class="skills-category-icon">
          <i class="fas ${iconMap[cat.icon] || 'fa-check'}"></i>
        </div>
        <h3 class="skills-category-title">${cat.category}</h3>
      </div>
      <div class="skills-list">
        ${(cat.items || []).map(skill => `
          <div class="skill-row">
            <span class="skill-name">
              <i class="fas fa-chevron-right" style="font-size: 0.65rem; color: var(--accent-terracotta);"></i>
              ${skill.name}
            </span>
            <span class="skill-level-badge">${skill.level || 'Proficient'}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

/* ====================================================================
   EDUCATION & TIMELINE RENDERING
   ==================================================================== */
function renderEducation(educationList) {
  const container = document.getElementById("education-timeline");
  if (!container) return;

  if (!educationList || educationList.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        No education records yet.
      </div>
    `;
    return;
  }

  container.innerHTML = educationList.map(edu => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <h3 class="timeline-degree">${edu.degree}</h3>
          <span class="timeline-period">${edu.period || ''}</span>
        </div>
        <div class="timeline-institution">
          <i class="fas fa-university" style="color: var(--accent-terracotta);"></i>
          ${edu.institution} ${edu.gpa ? `• <span style="color: var(--accent-forest); font-weight: 700;">GPA: ${edu.gpa}</span>` : ''}
        </div>
        ${edu.honors ? `
          <div class="timeline-honors">
            <i class="fas fa-award"></i> ${edu.honors}
          </div>
        ` : ''}
        ${edu.coursework && edu.coursework.length ? `
          <div>
            <div class="timeline-coursework-title">Key Academic Coursework:</div>
            <div class="coursework-chips">
              ${edu.coursework.map(c => `<span class="coursework-chip">${c}</span>`).join("")}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `).join("");
}

/* ====================================================================
   RESUME SHOWCASE BANNER RENDERING
   ==================================================================== */
function renderResumeBanner(resume) {
  const highlightsList = document.getElementById("resume-highlights-list");
  if (highlightsList) {
    const highlights = resume.highlights && resume.highlights.length > 0 ? resume.highlights : [
      "Dynamic academic projects and verifiable code repositories",
      "Specialized in modern computing architectures and software engineering",
      "Continuously updating with new skills and coursework"
    ];
    highlightsList.innerHTML = highlights.map(item => `
      <li>
        <i class="fas fa-check-circle"></i>
        <span>${item}</span>
      </li>
    `).join("");
  }
}

/* ====================================================================
   CONTACT SECTION RENDERING & ACTIONS
   ==================================================================== */
function renderContact(data) {
  const p = data.personal;
  const s = data.socialLinks;

  const emailEl = document.getElementById("contact-email-val");
  const phoneEl = document.getElementById("contact-phone-val");
  const locEl = document.getElementById("contact-location-val");
  const linkedinEl = document.getElementById("contact-linkedin-link");
  const githubEl = document.getElementById("contact-github-link");

  if (emailEl) emailEl.textContent = p.email || "email@example.com";
  if (phoneEl) phoneEl.textContent = p.phone || "Available on request";
  if (locEl) locEl.textContent = p.location || "USA";

  if (linkedinEl) {
    linkedinEl.href = s.linkedin || "#";
    linkedinEl.textContent = s.linkedin ? s.linkedin.replace(/^https?:\/\/(www\.)?/, '') : "LinkedIn Profile";
  }
  if (githubEl) {
    githubEl.href = s.github || "#";
    githubEl.textContent = s.github ? s.github.replace(/^https?:\/\/(www\.)?/, '') : "GitHub Profile";
  }

  // Contact Form Handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("form-name").value;
      const email = document.getElementById("form-email").value;
      const subject = document.getElementById("form-subject").value;
      const message = document.getElementById("form-message").value;

      const recipient = p.email || "contact@example.com";
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Sender: " + name + " (" + email + ")\n\n" + message)}`;
      
      showToast("Preparing email client...");
      setTimeout(() => {
        window.location.href = mailtoUrl;
        showToast("Email client opened.");
        contactForm.reset();
      }, 500);
    });
  }
}

window.copyEmailAddress = function() {
  const email = portfolioData.personal.email || "email@example.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copied ${email} to clipboard!`);
  }).catch(() => {
    showToast("Email: " + email);
  });
};

/* ====================================================================
   MODALS SYSTEM
   ==================================================================== */
function initModals() {
  const modals = document.querySelectorAll(".modal-backdrop");
  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

window.closeAllModals = function() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
  document.body.style.overflow = "";
};

// Open Project Details Modal
window.openProjectModal = function(projectId) {
  const proj = window.portfolioData.academicProjects.find(p => p.id === projectId);
  if (!proj) return;

  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("project-modal-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 1.5rem; max-height: 320px;">
      <img src="${proj.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(26,24,22,0.92)); padding: 1.5rem;">
        <span class="badge badge-course" style="margin-bottom: 0.5rem;">${proj.badge || 'Academic Project'}</span>
        <h2 style="font-size: 1.7rem; font-weight: 800; color: #fff;">${proj.title}</h2>
      </div>
    </div>

    ${proj.course ? `
      <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-terracotta); font-weight: 600; font-size: 0.95rem;">
        <i class="fas fa-graduation-cap"></i> ${proj.course} (${proj.term || 'Academic Work'})
      </div>
    ` : ''}

    <div>
      <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">
        Academic Project Overview
      </h4>
      <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.98rem;">
        ${proj.fullDesc || proj.shortDesc || 'Comprehensive academic project implementation.'}
      </p>
    </div>

    ${proj.keyOutcomes && proj.keyOutcomes.length ? `
      <div>
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">
          Key Academic Learning & Outcomes:
        </h4>
        <ul style="display: flex; flex-direction: column; gap: 0.5rem; list-style: none;">
          ${proj.keyOutcomes.map(outcome => `
            <li style="display: flex; align-items: flex-start; gap: 0.6rem; color: var(--text-secondary); font-size: 0.92rem;">
              <i class="fas fa-check" style="color: var(--accent-forest); margin-top: 0.25rem;"></i>
              <span>${outcome}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    ` : ''}

    <div>
      <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.6rem;">
        Technologies & Frameworks:
      </h4>
      <div class="project-tech-tags">
        ${(proj.techStack || []).map(t => `<span class="tech-tag-chip">${t}</span>`).join("")}
      </div>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 1rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); margin-top: 1rem;">
      ${proj.githubUrl ? `
        <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          <i class="fab fa-github"></i> View GitHub Repository
        </a>
      ` : ''}
      ${proj.demoUrl ? `
        <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i class="fas fa-external-link-alt"></i> Live Project Demo
        </a>
      ` : ''}
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

// Open Digital Resume Preview Modal
window.openResumeModal = function() {
  const modal = document.getElementById("resume-modal");
  const resumeContainer = document.getElementById("digital-resume-container");
  if (!modal || !resumeContainer) return;

  const p = window.portfolioData.personal;
  const s = window.portfolioData.socialLinks;

  resumeContainer.innerHTML = `
    <div class="resume-sheet">
      <div class="resume-sheet-header">
        <h1 class="resume-sheet-name">${p.name || 'Your Name'}</h1>
        <div style="font-size: 1.1rem; color: var(--accent-terracotta); font-weight: 600; margin-top: 0.25rem;">
          ${p.title || 'Software Engineer'}
        </div>
        <div class="resume-sheet-contact">
          ${p.location ? `<span><i class="fas fa-map-marker-alt"></i> ${p.location}</span>` : ''}
          ${p.email ? `<span><i class="fas fa-envelope"></i> ${p.email}</span>` : ''}
          ${s.linkedin ? `<span><i class="fab fa-linkedin"></i> ${s.linkedin.replace(/^https?:\/\//, '')}</span>` : ''}
          ${s.github ? `<span><i class="fab fa-github"></i> ${s.github.replace(/^https?:\/\//, '')}</span>` : ''}
        </div>
      </div>

      ${p.bio ? `
        <div>
          <h3 class="resume-sheet-section-title">Professional Summary</h3>
          <p style="color: var(--text-secondary);">${p.bio}</p>
        </div>
      ` : ''}

      ${window.portfolioData.education && window.portfolioData.education.length > 0 ? `
        <div>
          <h3 class="resume-sheet-section-title">Education</h3>
          ${window.portfolioData.education.map(edu => `
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary);">
                <span>${edu.institution}</span>
                <span style="color: var(--accent-terracotta);">${edu.period || ''}</span>
              </div>
              <div style="display: flex; justify-content: space-between; color: var(--text-secondary); font-size: 0.94rem;">
                <span>${edu.degree}</span>
                ${edu.gpa ? `<span style="font-weight: 600;">GPA: ${edu.gpa}</span>` : ''}
              </div>
              ${edu.honors ? `<div style="font-size: 0.88rem; color: var(--accent-gold); margin-top: 0.2rem;">${edu.honors}</div>` : ''}
              ${edu.coursework && edu.coursework.length ? `
                <div style="margin-top: 0.35rem; font-size: 0.84rem; color: var(--text-muted);">
                  <strong>Relevant Coursework:</strong> ${edu.coursework.join(", ")}
                </div>
              ` : ''}
            </div>
          `).join("")}
        </div>
      ` : ''}

      ${window.portfolioData.academicProjects && window.portfolioData.academicProjects.length > 0 ? `
        <div>
          <h3 class="resume-sheet-section-title">Key Academic Projects</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${window.portfolioData.academicProjects.map(proj => `
              <div>
                <div style="font-weight: 700; color: var(--text-primary); display: flex; justify-content: space-between;">
                  <span>${proj.title}</span>
                  <span style="font-size: 0.84rem; color: var(--accent-terracotta);">${proj.term || ''}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${proj.shortDesc || ''}</div>
                ${proj.techStack && proj.techStack.length ? `
                  <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
                    Stack: ${proj.techStack.join(", ")}
                  </div>
                ` : ''}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

/* ====================================================================
   NAVIGATION & ACTIVE LINK WATCHER
   ==================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      mobileDrawer.classList.toggle("open");
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileToggle.classList.remove("active");
        mobileDrawer.classList.remove("open");
      });
    });
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function initScrollWatchers() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

/* ====================================================================
   TOAST NOTIFICATION UTILITY
   ==================================================================== */
window.showToast = function(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-info-circle" style="color: var(--accent-terracotta);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
};
