
document.addEventListener("DOMContentLoaded", () => {
  loadSavedCustomizations();
  initCustomizerModal();
  initWholeResumeImporter();
});

function loadSavedCustomizations() {
  try {
    const saved = localStorage.getItem("custom_portfolio_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(window.portfolioData, parsed);
      refreshPortfolioViews();
    }
  } catch (err) {
    console.warn("Could not load local customizer settings:", err);
  }
}

function refreshPortfolioViews() {
  if (typeof renderHeroAndPersonal === "function") renderHeroAndPersonal(window.portfolioData);
  if (typeof renderStats === "function") renderStats(window.portfolioData.personal.stats);
  if (typeof renderAcademicProjects === "function") renderAcademicProjects(window.portfolioData.academicProjects);
  if (typeof renderSkills === "function") renderSkills(window.portfolioData.skills);
  if (typeof renderEducation === "function") renderEducation(window.portfolioData.education);
  if (typeof renderResumeBanner === "function") renderResumeBanner(window.portfolioData.resume);
  if (typeof renderContact === "function") renderContact(window.portfolioData);
}

/* ====================================================================
   WHOLE RESUME IMPORTER (Paste raw resume text -> Auto-fill everything!)
   ==================================================================== */
function initWholeResumeImporter() {
  const openImporterBtn = document.getElementById("open-importer-btn");
  const bannerImportBtn = document.getElementById("banner-import-btn");
  const importerModal = document.getElementById("importer-modal");
  const runParserBtn = document.getElementById("run-resume-parser-btn");
  const resumeTextInput = document.getElementById("raw-resume-textarea");
  const clearDataBtn = document.getElementById("clear-all-data-btn");
  const pdfFileInput = document.getElementById("resume-file-upload");

  const openModal = () => {
    if (importerModal) {
      importerModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  if (openImporterBtn) openImporterBtn.addEventListener("click", openModal);
  if (bannerImportBtn) bannerImportBtn.addEventListener("click", openModal);

  // Resume File Upload (Local PDF Blob handler)
  if (pdfFileInput) {
    pdfFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileUrl = URL.createObjectURL(file);
      window.portfolioData.resume.pdfPath = fileUrl;
      window.portfolioData.resume.filename = file.name;

      const downloadBtns = document.querySelectorAll(".btn-download-resume");
      downloadBtns.forEach(btn => {
        btn.setAttribute("href", fileUrl);
        btn.setAttribute("download", file.name);
      });

      // If text file, read into textarea
      if (file.type.includes("text") || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (re) => {
          if (resumeTextInput) resumeTextInput.value = re.target.result;
        };
        reader.readAsText(file);
      }

      showToast(`📄 Uploaded "${file.name}" as active resume!`);
    });
  }

  // Parse Text and populate whole portfolio
  if (runParserBtn && resumeTextInput) {
    runParserBtn.addEventListener("click", () => {
      const text = resumeTextInput.value.trim();
      if (!text) {
        alert("Please paste your resume text first!");
        return;
      }

      if (typeof parseResumeText !== "function") {
        alert("Parser engine not loaded. Please refresh the page.");
        return;
      }

      const parsedData = parseResumeText(text);
      if (!parsedData) {
        alert("Could not extract data from the text. Please check the text format.");
        return;
      }

      // Merge parsed data into active portfolioData
      window.portfolioData.personal.name = parsedData.personal.name || window.portfolioData.personal.name;
      window.portfolioData.personal.title = parsedData.personal.title || window.portfolioData.personal.title;
      window.portfolioData.personal.email = parsedData.personal.email || window.portfolioData.personal.email;
      window.portfolioData.personal.phone = parsedData.personal.phone || window.portfolioData.personal.phone;
      window.portfolioData.personal.bio = parsedData.personal.bio || window.portfolioData.personal.bio;

      if (parsedData.socialLinks.linkedin) window.portfolioData.socialLinks.linkedin = parsedData.socialLinks.linkedin;
      if (parsedData.socialLinks.github) window.portfolioData.socialLinks.github = parsedData.socialLinks.github;
      if (parsedData.socialLinks.email) window.portfolioData.socialLinks.email = parsedData.socialLinks.email;

      if (parsedData.academicProjects && parsedData.academicProjects.length > 0) {
        window.portfolioData.academicProjects = parsedData.academicProjects;
      }

      if (parsedData.skills && parsedData.skills.length > 0) {
        window.portfolioData.skills = parsedData.skills;
      }

      if (parsedData.education && parsedData.education.length > 0) {
        window.portfolioData.education = parsedData.education;
        window.portfolioData.resume.digitalResume.education = parsedData.education;
      }

      // Save to localStorage
      saveCurrentStateToLocalStorage();
      refreshPortfolioViews();

      if (importerModal) importerModal.classList.remove("active");
      document.body.style.overflow = "";

      showToast("🎉 Entire portfolio successfully populated from your resume!");
    });
  }

  // Clear all sample / template data
  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", () => {
      if (confirm("Clear all sample placeholder data and start with a completely empty portfolio?")) {
        window.portfolioData.personal.name = "Your Name";
        window.portfolioData.personal.title = "Your Title";
        window.portfolioData.personal.bio = "Add your bio here...";
        window.portfolioData.personal.email = "your.email@example.com";
        window.portfolioData.socialLinks.linkedin = "https://linkedin.com/in/";
        window.portfolioData.socialLinks.github = "https://github.com/";
        window.portfolioData.academicProjects = [];
        window.portfolioData.skills = [];
        window.portfolioData.education = [];
        saveCurrentStateToLocalStorage();
        refreshPortfolioViews();
        showToast("Cleared sample data. Ready for your information!");
        if (importerModal) importerModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
}

function saveCurrentStateToLocalStorage() {
  localStorage.setItem("custom_portfolio_data", JSON.stringify({
    personal: window.portfolioData.personal,
    socialLinks: window.portfolioData.socialLinks,
    resume: window.portfolioData.resume,
    academicProjects: window.portfolioData.academicProjects,
    skills: window.portfolioData.skills,
    education: window.portfolioData.education
  }));
}

/* ====================================================================
   CUSTOMIZER MODAL HANDLERS
   ==================================================================== */
function initCustomizerModal() {
  const customizerModal = document.getElementById("customizer-modal");
  const openBtn = document.getElementById("open-customizer-btn");
  const saveBtn = document.getElementById("save-customizer-btn");
  const exportBtn = document.getElementById("export-customizer-btn");
  const resetBtn = document.getElementById("reset-customizer-btn");

  if (!customizerModal) return;

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      populateCustomizerForm();
      customizerModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      applyFormChanges();
      showToast("✨ Changes applied and saved to your browser!");
      customizerModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      applyFormChanges();
      exportConfigAsFile();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all customized fields back to original template defaults?")) {
        localStorage.removeItem("custom_portfolio_data");
        location.reload();
      }
    });
  }
}

function populateCustomizerForm() {
  const p = window.portfolioData.personal;
  const s = window.portfolioData.socialLinks;
  const r = window.portfolioData.resume;

  setInputValue("custom-name", p.name);
  setInputValue("custom-title", p.title);
  setInputValue("custom-badge", p.badge);
  setInputValue("custom-bio", p.bio);
  setInputValue("custom-email", p.email);
  setInputValue("custom-location", p.location);
  setInputValue("custom-phone", p.phone || "");

  setInputValue("custom-linkedin", s.linkedin);
  setInputValue("custom-github", s.github);
  setInputValue("custom-twitter", s.twitter || "");

  setInputValue("custom-resume-url", r.pdfPath);
  setInputValue("custom-resume-filename", r.filename);

  renderCustomizerProjectsList();
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function renderCustomizerProjectsList() {
  const listContainer = document.getElementById("customizer-projects-list");
  if (!listContainer) return;

  const projects = window.portfolioData.academicProjects;
  if (projects.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
        No academic projects yet. Click below to add your first project!
      </div>
      <div style="padding: 0.5rem 0;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="addNewProjectPrompt()">
          <i class="fas fa-plus"></i> Add New Academic Project
        </button>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = projects.map((proj, idx) => `
    <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 0.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
        <strong style="color: var(--text-primary); font-size: 0.95rem;">${idx + 1}. ${proj.title}</strong>
        <div>
          <button type="button" onclick="deleteProjectAt(${idx})" style="color: #ef4444; font-size: 0.8rem; margin-right: 0.5rem;" title="Delete project">
            <i class="fas fa-trash"></i>
          </button>
          <span style="font-size: 0.75rem; color: var(--accent-cyan);">${proj.course || 'Project'}</span>
        </div>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem;">
        <i class="fab fa-github"></i> ${proj.githubUrl || 'None'}
      </div>
    </div>
  `).join("") + `
    <div style="padding: 0.5rem 0;">
      <button type="button" class="btn btn-secondary btn-sm" onclick="addNewProjectPrompt()">
        <i class="fas fa-plus"></i> Add New Academic Project
      </button>
    </div>
  `;
}

window.deleteProjectAt = function(idx) {
  if (confirm("Remove this project?")) {
    window.portfolioData.academicProjects.splice(idx, 1);
    renderCustomizerProjectsList();
    renderAcademicProjects(window.portfolioData.academicProjects);
    showToast("Project removed");
  }
};

window.addNewProjectPrompt = function() {
  const title = prompt("Enter Academic Project Title:");
  if (!title) return;
  const course = prompt("Enter Course Name (e.g. CS401: Capstone Project):", "CS401: Capstone Project");
  const shortDesc = prompt("Enter Short Project Description:", "A modern full-stack academic project.");
  const githubUrl = prompt("Enter GitHub Repository Link:", "https://github.com/yourusername/project");
  const tech = prompt("Enter Tech Stack (comma-separated):", "Python, React, PostgreSQL");

  const newProj = {
    id: "proj-" + Date.now(),
    title: title,
    category: "academic",
    badge: "Academic Project",
    course: course || "Academic Work",
    term: "2024",
    shortDesc: shortDesc || "",
    fullDesc: shortDesc || "",
    keyOutcomes: [
      "Engineered comprehensive project specifications and tests.",
      "Successfully verified all academic deliverables."
    ],
    techStack: tech ? tech.split(",").map(t => t.trim()) : ["Software Engineering"],
    githubUrl: githubUrl || "",
    demoUrl: "",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    featured: false
  };

  window.portfolioData.academicProjects.unshift(newProj);
  renderCustomizerProjectsList();
  renderAcademicProjects(window.portfolioData.academicProjects);
  showToast("Added project: " + title);
};

function applyFormChanges() {
  window.portfolioData.personal.name = getInputValue("custom-name") || window.portfolioData.personal.name;
  window.portfolioData.personal.title = getInputValue("custom-title") || window.portfolioData.personal.title;
  window.portfolioData.personal.badge = getInputValue("custom-badge") || window.portfolioData.personal.badge;
  window.portfolioData.personal.bio = getInputValue("custom-bio") || window.portfolioData.personal.bio;
  window.portfolioData.personal.email = getInputValue("custom-email") || window.portfolioData.personal.email;
  window.portfolioData.personal.location = getInputValue("custom-location") || window.portfolioData.personal.location;
  window.portfolioData.personal.phone = getInputValue("custom-phone") || window.portfolioData.personal.phone;

  window.portfolioData.socialLinks.linkedin = getInputValue("custom-linkedin") || window.portfolioData.socialLinks.linkedin;
  window.portfolioData.socialLinks.github = getInputValue("custom-github") || window.portfolioData.socialLinks.github;
  window.portfolioData.socialLinks.twitter = getInputValue("custom-twitter") || window.portfolioData.socialLinks.twitter;
  window.portfolioData.socialLinks.email = "mailto:" + window.portfolioData.personal.email;

  window.portfolioData.resume.pdfPath = getInputValue("custom-resume-url") || window.portfolioData.resume.pdfPath;
  window.portfolioData.resume.filename = getInputValue("custom-resume-filename") || window.portfolioData.resume.filename;

  saveCurrentStateToLocalStorage();
  refreshPortfolioViews();
}

function exportConfigAsFile() {
  const codeContent = `/**
 * ====================================================================
 * PORTFOLIO DATA CONFIGURATION
 * Exported from Live Portfolio Customizer
 * ====================================================================
 */

const portfolioData = ${JSON.stringify(window.portfolioData, null, 2)};

if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
`;

  const blob = new Blob([codeContent], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "portfolio-data.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("💾 portfolio-data.js downloaded! Replace your file in js/ folder.");
}
