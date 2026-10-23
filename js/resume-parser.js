
function parseResumeText(rawText) {
  if (!rawText || typeof rawText !== "string") return null;

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return null;

  const result = {
    personal: {
      name: "",
      title: "",
      badge: "Available for Opportunities",
      location: "",
      email: "",
      phone: "",
      bio: "",
      tagline: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      stats: []
    },
    socialLinks: {
      linkedin: "",
      github: "",
      email: "",
      twitter: "",
      portfolio: ""
    },
    resume: {
      pdfPath: "assets/Manab_Roy_Resume (3).pdf",
      filename: "Manab_Roy_Resume (3).pdf",
      highlights: [],
      digitalResume: {
        summary: "",
        education: [],
        experience: []
      }
    },
    academicProjects: [],
    skills: [],
    education: []
  };

  // 1. EXTRACT SOCIAL LINKS & CONTACT VIA REGEX ACROSS ENTIRE TEXT
  const fullText = rawText;

  // Email
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.personal.email = emailMatch[0];
    result.socialLinks.email = "mailto:" + emailMatch[0];
  }

  // Phone
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    result.personal.phone = phoneMatch[0];
  }

  // LinkedIn
  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    result.socialLinks.linkedin = linkedinMatch[0].startsWith("http") ? linkedinMatch[0] : "https://" + linkedinMatch[0];
  }

  // GitHub
  const githubMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    result.socialLinks.github = githubMatch[0].startsWith("http") ? githubMatch[0] : "https://" + githubMatch[0];
  }

  // Portfolio / Website
  const webMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:io|dev|me|tech|com|org|net)(?:\/[^\s]*)?/i);
  if (webMatch && !webMatch[0].includes("linkedin") && !webMatch[0].includes("github")) {
    result.socialLinks.portfolio = webMatch[0].startsWith("http") ? webMatch[0] : "https://" + webMatch[0];
  }

  // 2. EXTRACT NAME & TITLE (Usually top 2-3 lines)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Check if line is not contact info
    if (!line.includes("@") && !line.includes("linkedin") && !line.includes("github") && !line.includes("http") && !line.match(/\d{3}/)) {
      if (!result.personal.name) {
        result.personal.name = line.replace(/^[#*-]\s*/, '').trim();
      } else if (!result.personal.title && line.length < 80) {
        result.personal.title = line.replace(/^[#*-]\s*/, '').trim();
        break;
      }
    }
  }

  // Fallbacks if not detected
  if (!result.personal.name) result.personal.name = "My Portfolio";
  if (!result.personal.title) result.personal.title = "Software Engineer & Scholar";

  // 3. SEGMENT BY HEADINGS (EDUCATION, PROJECTS, SKILLS, EXPERIENCE)
  const sections = {
    summary: [],
    education: [],
    projects: [],
    skills: [],
    experience: []
  };

  let currentSection = "summary";

  const isHeading = (line) => {
    const clean = line.toUpperCase().replace(/[^A-Z\s]/g, '').trim();
    if (clean === "EDUCATION" || clean === "ACADEMIC BACKGROUND" || clean === "ACADEMICS") return "education";
    if (clean.includes("PROJECT") || clean.includes("ACADEMIC PROJECT") || clean.includes("CAPSTONE") || clean.includes("COURSEWORK PROJECT")) return "projects";
    if (clean.includes("SKILL") || clean.includes("TECHNICAL SKILL") || clean.includes("TECHNOLOGIES")) return "skills";
    if (clean.includes("EXPERIENCE") || clean.includes("WORK EXPERIENCE") || clean.includes("EMPLOYMENT") || clean.includes("RESEARCH")) return "experience";
    if (clean.includes("SUMMARY") || clean.includes("OBJECTIVE") || clean.includes("ABOUT")) return "summary";
    return null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const detected = isHeading(line);
    if (detected) {
      currentSection = detected;
      continue;
    }
    sections[currentSection].push(line);
  }

  // 4. PROCESS SUMMARY / BIO
  if (sections.summary.length > 0) {
    const bioText = sections.summary.filter(l => !l.includes("@") && !l.includes("linkedin") && !l.includes("github")).join(" ");
    result.personal.bio = bioText.length > 20 ? bioText : `Welcome to my portfolio! I am ${result.personal.name}, a passionate developer specializing in modern engineering and dynamic projects.`;
  } else {
    result.personal.bio = `Welcome to my portfolio! I am ${result.personal.name}, a passionate developer specializing in modern engineering and dynamic projects.`;
  }

  // 5. PROCESS SKILLS
  if (sections.skills.length > 0) {
    const allSkillLines = sections.skills;
    const detectedCategories = [];
    let currentCat = { category: "Core Technologies", icon: "code", items: [] };

    allSkillLines.forEach(line => {
      // Check if line is formatted as "Category: Skill1, Skill2, Skill3"
      if (line.includes(":")) {
        const parts = line.split(":");
        const catName = parts[0].replace(/^[#*-]\s*/, '').trim();
        const skillList = parts[1].split(/[,|•/]/).map(s => s.trim()).filter(s => s.length > 0);
        
        detectedCategories.push({
          category: catName,
          icon: catName.toLowerCase().includes("lang") ? "code" : catName.toLowerCase().includes("tool") ? "wrench" : "layers",
          items: skillList.map(s => ({ name: s, level: "Proficient", iconName: "code" }))
        });
      } else {
        const list = line.split(/[,|•/]/).map(s => s.trim()).filter(s => s.length > 1);
        list.forEach(item => {
          currentCat.items.push({ name: item, level: "Proficient", iconName: "code" });
        });
      }
    });

    if (detectedCategories.length > 0) {
      result.skills = detectedCategories;
    } else if (currentCat.items.length > 0) {
      result.skills = [currentCat];
    }
  }

  // Default skills if none detected
  if (result.skills.length === 0) {
    result.skills = [
      {
        category: "Programming & Tools",
        icon: "code",
        items: [
          { name: "Python", level: "Advanced", iconName: "python" },
          { name: "JavaScript", level: "Advanced", iconName: "javascript" },
          { name: "Git & GitHub", level: "Proficient", iconName: "git" },
          { name: "SQL", level: "Proficient", iconName: "sql" }
        ]
      }
    ];
  }

  // 6. PROCESS ACADEMIC PROJECTS
  if (sections.projects.length > 0) {
    const projectBlocks = [];
    let currentBlock = [];

    sections.projects.forEach(line => {
      // If line looks like a new project title (not a bullet point)
      const isBullet = line.startsWith("-") || line.startsWith("•") || line.startsWith("*");
      if (!isBullet && line.length < 80 && (line.match(/\((?:20\d\d|Spring|Fall|Summer|Winter)\)/i) || currentBlock.length > 3)) {
        if (currentBlock.length > 0) {
          projectBlocks.push(currentBlock);
          currentBlock = [];
        }
      }
      currentBlock.push(line);
    });
    if (currentBlock.length > 0) projectBlocks.push(currentBlock);

    // If no distinct blocks were split, group by every 3-5 lines
    if (projectBlocks.length === 0 && sections.projects.length > 0) {
      projectBlocks.push(sections.projects);
    }

    result.academicProjects = projectBlocks.map((block, idx) => {
      const titleLine = block[0].replace(/^[#*-]\s*/, '').trim();
      const bullets = block.slice(1).filter(l => l.startsWith("-") || l.startsWith("•") || l.startsWith("*")).map(l => l.replace(/^[-•*]\s*/, '').trim());
      const otherLines = block.slice(1).filter(l => !l.startsWith("-") && !l.startsWith("•") && !l.startsWith("*"));

      // Extract tech stack if line says "Tech: ..." or "Stack: ..."
      let techStack = ["Software Development"];
      const techLine = block.find(l => l.toLowerCase().includes("tech") || l.toLowerCase().includes("stack") || l.toLowerCase().includes("tools:"));
      if (techLine) {
        const afterColon = techLine.split(":")[1];
        if (afterColon) {
          techStack = afterColon.split(/[,|•/]/).map(t => t.trim()).filter(t => t.length > 0);
        }
      }

      // Extract github link in project if any
      const projGithub = block.map(l => l.match(/github\.com\/[^\s]+/)).find(m => m !== null);

      return {
        id: "parsed-proj-" + (idx + 1),
        title: titleLine || `Academic Project ${idx + 1}`,
        category: "academic",
        badge: "Academic Project",
        course: "Coursework & Lab",
        term: "Academic Work",
        shortDesc: bullets[0] || otherLines[0] || "Academic engineering project demonstrating key principles and implementation.",
        fullDesc: bullets.join(" ") || otherLines.join(" ") || "Academic project implementation.",
        keyOutcomes: bullets.length > 0 ? bullets : ["Implemented core functionality according to project requirements."],
        techStack: techStack,
        githubUrl: projGithub ? (projGithub[0].startsWith("http") ? projGithub[0] : "https://" + projGithub[0]) : result.socialLinks.github,
        demoUrl: "",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
        featured: idx === 0
      };
    });
  }

  // 7. PROCESS EDUCATION
  if (sections.education.length > 0) {
    const eduLines = sections.education;
    let institution = "";
    let degree = "";
    let gpa = "";
    let period = "";

    eduLines.forEach(line => {
      if (line.toLowerCase().includes("university") || line.toLowerCase().includes("college") || line.toLowerCase().includes("institute") || line.toLowerCase().includes("school")) {
        institution = line;
      } else if (line.toLowerCase().includes("bachelor") || line.toLowerCase().includes("master") || line.toLowerCase().includes("b.s.") || line.toLowerCase().includes("b.tech") || line.toLowerCase().includes("degree") || line.toLowerCase().includes("diploma")) {
        degree = line;
      }
      
      const gpaMatch = line.match(/(?:gpa|cgpa)[:\s]+([0-9.]+(?:\s*\/\s*[0-9.]+)?)/i);
      if (gpaMatch) gpa = gpaMatch[1];

      const periodMatch = line.match(/(?:20\d\d\s*[-–—]\s*(?:20\d\d|Present|Expected)|20\d\d)/i);
      if (periodMatch) period = periodMatch[0];
    });

    result.education = [
      {
        institution: institution || "University / College",
        degree: degree || "Degree in Computer Science / Engineering",
        period: period || "2021 — 2025",
        gpa: gpa || "3.8 / 4.0",
        location: result.personal.location || "",
        honors: "Academic Scholar",
        coursework: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"]
      }
    ];

    result.resume.digitalResume.education = result.education;
  }

  // 8. UPDATE STATS DYNAMICALLY
  result.personal.stats = [
    { label: "Academic Projects", value: `${result.academicProjects.length || 1}+` },
    { label: "Technical Skills", value: `${result.skills.reduce((acc, cat) => acc + cat.items.length, 0) || 5}+` },
    { label: "Education Status", value: "Verified" },
    { label: "Code Repositories", value: result.socialLinks.github ? "Active" : "Ready" }
  ];

  return result;
}

if (typeof window !== "undefined") {
  window.parseResumeText = parseResumeText;
}
