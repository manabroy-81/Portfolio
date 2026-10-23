
const portfolioData = {
  // Personal & Hero Information
  personal: {
    name: "Alex Johnson",
    title: "Computer Science Student & Aspiring Software Engineer",
    badge: "Available for Internships & Full-Time Roles",
    location: "New York, USA",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 019-2834",
    bio: "Passionate undergraduate Computer Science scholar focused on building scalable software, intelligent data systems, and human-centric web applications. Actively seeking opportunities to solve complex real-world engineering challenges.",
    tagline: "Bridging theoretical computer science with high-impact software engineering.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    stats: [
      { label: "Academic Projects", value: "8+" },
      { label: "CGPA / GPA", value: "3.9 / 4.0" },
      { label: "Core Technologies", value: "15+" },
      { label: "Academic Awards", value: "3" }
    ]
  },

  // Social & Professional Profiles (GitHub, LinkedIn, etc.)
  socialLinks: {
    linkedin: "https://linkedin.com/in/alex-johnson-cs",
    github: "https://github.com/alexjohnson-dev",
    email: "mailto:alex.johnson@example.com",
    twitter: "https://twitter.com/alexjohnson_cs",
    portfolio: "https://alexjohnson.dev"
  },

  // Resume Configuration
  resume: {
    // Put your resume PDF in the assets folder and set the filename here
    pdfPath: "assets/resume.pdf",
    filename: "Alex_Johnson_Resume.pdf",
    lastUpdated: "October 2024",
    highlights: [
      "Dean's Honor List for 6 consecutive semesters",
      "Specialization in Distributed Systems & Machine Learning",
      "Lead Student Researcher at University AI Systems Lab",
      "Top 5% in National Collegiate Coding Championship"
    ],
    // Structured digital resume for instant on-screen preview
    digitalResume: {
      summary: "Computer Science student with strong foundations in Data Structures, Algorithms, Distributed Computing, and Full-Stack Development. Proven track record of delivering end-to-end academic capstone projects with modern web technologies, Python, and cloud services.",
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "State University of Science & Technology",
          period: "2021 - 2025",
          gpa: "3.92 / 4.0",
          honors: "Summa Cum Laude Candidate, Academic Excellence Scholar",
          courses: ["Advanced Algorithms", "Distributed Systems", "Operating Systems", "Deep Learning", "Database Systems", "Software Architecture"]
        }
      ],
      experience: [
        {
          role: "Undergraduate Research Assistant",
          organization: "University AI & Data Intelligence Lab",
          period: "Jan 2024 - Present",
          location: "On-Campus",
          bullets: [
            "Co-authored research on optimizing inference latency for lightweight transformers on edge hardware.",
            "Engineered Python and PyTorch benchmarks across 12 distinct neural network topologies.",
            "Presented preliminary findings at the Regional Collegiate Undergraduate Research Symposium."
          ]
        },
        {
          role: "Software Engineering Intern",
          organization: "InnovateTech Solutions",
          period: "Jun 2023 - Aug 2023",
          location: "Remote",
          bullets: [
            "Developed RESTful microservices using Node.js and PostgreSQL, cutting API response times by 28%.",
            "Implemented responsive React components with automated Jest unit test coverage reaching 92%.",
            "Collaborated in Agile sprints with daily standups, code reviews, and CI/CD pipelines via GitHub Actions."
          ]
        }
      ]
    }
  },

  // Academic Projects Section
  // Highlight your coursework, capstone, thesis, research, and lab projects here!
  academicProjects: [
    {
      id: "proj-1",
      title: "Distributed Fault-Tolerant Key-Value Store",
      category: "academic",
      badge: "Final Year Capstone Project",
      course: "CS 450: Distributed Systems & Cloud Infrastructure",
      term: "Fall 2024",
      shortDesc: "A Raft consensus-based distributed distributed storage engine capable of dynamic node discovery and zero-loss failover.",
      fullDesc: "Designed and implemented a distributed key-value storage engine in Go from scratch. The system implements the Raft consensus algorithm for leader election, log replication, and cluster membership changes. Conducted extensive chaotic network partition experiments to verify strict linearizability and data integrity under node dropouts.",
      keyOutcomes: [
        "Implemented Raft consensus algorithm handling up to 7 distributed replicas",
        "Achieved 12,500 read/write operations/second under standard network conditions",
        "Survives 40% node dropout without data loss or split-brain inconsistencies",
        "Received Grade: A+ (Highest scoring project in department)"
      ],
      techStack: ["Go (Golang)", "gRPC", "Protobuf", "Docker", "Raft Consensus", "Prometheus"],
      githubUrl: "https://github.com/alexjohnson-dev/distributed-raft-kv",
      demoUrl: "https://github.com/alexjohnson-dev/distributed-raft-kv#architecture",
      paperUrl: "#", // Can be a link to paper/report PDF
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: "proj-2",
      title: "AI Medical Imaging Diagnosis Assistant",
      category: "ai-ml",
      badge: "University Research Project",
      course: "CS 480: Deep Learning & Computer Vision",
      term: "Spring 2024",
      shortDesc: "Convolutional Neural Network capable of multi-label thoracic pathology detection from anonymized chest X-ray scans with Grad-CAM heatmaps.",
      fullDesc: "Developed an end-to-end computer vision pipeline trained on the NIH ChestX-ray14 dataset (over 100,000 radiograph images). Implemented ResNet-50 and EfficientNet backbones with transfer learning, focal loss for handling class imbalance, and integrated Grad-CAM visual explainability maps for clinical transparency.",
      keyOutcomes: [
        "Achieved 0.887 mean AUROC score across 14 distinct pathological thoracic conditions",
        "Integrated Grad-CAM visual heatmaps allowing radiologists to verify attention regions",
        "Engineered an interactive web-based clinician diagnosis dashboard using Streamlit & FastAPI",
        "Selected for University Engineering Showcase 2024"
      ],
      techStack: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker", "Weights & Biases", "NumPy"],
      githubUrl: "https://github.com/alexjohnson-dev/ai-medical-vision-diag",
      demoUrl: "https://github.com/alexjohnson-dev/ai-medical-vision-diag#demo",
      paperUrl: "#",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: "proj-3",
      title: "University Course Registration & Scheduling Engine",
      category: "web-dev",
      badge: "Database Systems Project",
      course: "CS 330: Advanced Database Management Systems",
      term: "Fall 2023",
      shortDesc: "A high-concurrency student registration platform with automated conflict detection, waitlist priority queues, and analytics.",
      fullDesc: "Architected a comprehensive university course enrollment web system to solve high-concurrency race conditions during peak registration windows. Modeled an optimized relational schema in PostgreSQL with row-level locking, automated triggers, and transactional integrity.",
      keyOutcomes: [
        "Eliminated double-booking race conditions during simulated 2,000 concurrent user enrollments",
        "Implemented graph-based prerequisite validation algorithm preventing invalid registrations",
        "Designed clean administrative dashboards for department chairs to monitor seat allocations",
        "Received top recommendation from course faculty"
      ],
      techStack: ["React.js", "Node.js", "PostgreSQL", "Redis", "Tailwind CSS", "Prisma ORM"],
      githubUrl: "https://github.com/alexjohnson-dev/course-registration-engine",
      demoUrl: "https://github.com/alexjohnson-dev/course-registration-engine",
      paperUrl: "",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: "proj-4",
      title: "Algorithmic Market Sentiment & News Analyzer",
      category: "data-science",
      badge: "Data Science Capstone",
      course: "CS 410: Natural Language Processing & Text Mining",
      term: "Spring 2024",
      shortDesc: "Real-time financial news stream pipeline extracting entity sentiments and correlating with stock volatility indicators.",
      fullDesc: "Built an automated NLP streaming pipeline using FinBERT to scrape, clean, and process real-time financial articles and SEC filings. Correlated polarity scores with intraday price movements using pandas and time-series analysis.",
      keyOutcomes: [
        "Processes and scores 500+ news articles every minute with sub-second latency",
        "Fine-tuned FinBERT model yielding 86.4% precision on financial domain text",
        "Built dynamic visualizations with Chart.js and Plotly"
      ],
      techStack: ["Python", "Hugging Face", "FinBERT", "Apache Kafka", "Pandas", "Plotly"],
      githubUrl: "https://github.com/alexjohnson-dev/financial-sentiment-nlp",
      demoUrl: "https://github.com/alexjohnson-dev/financial-sentiment-nlp",
      paperUrl: "",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: "proj-5",
      title: "Compiler & Bytecode Virtual Machine",
      category: "academic",
      badge: "Systems Programming Project",
      course: "CS 360: Principles of Programming Languages & Compilers",
      term: "Spring 2023",
      shortDesc: "A custom lexer, parser, abstract syntax tree (AST) generator, and stack-based virtual machine written in C++.",
      fullDesc: "Engineered a full compiler and stack-based bytecode interpreter for a custom dynamically typed scripting language called 'Lumen'. Features recursive descent parsing, bytecode optimization, and mark-and-sweep garbage collection.",
      keyOutcomes: [
        "Custom Pratt expression parser with operator precedence support",
        "Generates clean bytecode instructions executed by an optimized C++ virtual machine",
        "Implemented mark-and-sweep automatic memory management without memory leaks",
        "Verified with 100+ automated test suites"
      ],
      techStack: ["C++17", "CMake", "LLVM Concepts", "Valgrind", "GDB", "Git"],
      githubUrl: "https://github.com/alexjohnson-dev/lumen-lang-compiler",
      demoUrl: "https://github.com/alexjohnson-dev/lumen-lang-compiler",
      paperUrl: "",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: "proj-6",
      title: "Peer-to-Peer Encrypted File Sharing Mesh",
      category: "web-dev",
      badge: "Network Security Lab",
      course: "CS 435: Computer Networks & Cryptography",
      term: "Fall 2023",
      shortDesc: "Decentralized browser-to-browser P2P file transfer utilizing WebRTC data channels with end-to-end AES-256-GCM encryption.",
      fullDesc: "Created a zero-server peer-to-peer file distribution protocol running entirely inside modern web browsers. Utilizes WebRTC data channels for direct node transmission, ECDH key exchange for session setup, and client-side AES-GCM chunked stream encryption.",
      keyOutcomes: [
        "100% serverless transfer of files up to 2GB directly between browser peers",
        "End-to-end cryptographic security where relay servers never view payload data",
        "Automatic fallback handling with STUN/TURN traversal algorithms"
      ],
      techStack: ["TypeScript", "WebRTC", "Web Cryptography API", "Node.js (Signaling)", "Tailwind"],
      githubUrl: "https://github.com/alexjohnson-dev/p2p-secure-mesh",
      demoUrl: "https://github.com/alexjohnson-dev/p2p-secure-mesh",
      paperUrl: "",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      featured: false
    }
  ],

  // Skills Categories
  skills: [
    {
      category: "Programming Languages",
      icon: "code",
      items: [
        { name: "Python", level: "Advanced", iconName: "python" },
        { name: "Java", level: "Advanced", iconName: "java" },
        { name: "C / C++", level: "Proficient", iconName: "cpp" },
        { name: "JavaScript / TypeScript", level: "Advanced", iconName: "javascript" },
        { name: "Go (Golang)", level: "Intermediate", iconName: "golang" },
        { name: "SQL (Postgres, MySQL)", level: "Advanced", iconName: "sql" }
      ]
    },
    {
      category: "Frameworks & Libraries",
      icon: "layers",
      items: [
        { name: "React.js / Next.js", level: "Advanced", iconName: "react" },
        { name: "Node.js / Express", level: "Advanced", iconName: "node" },
        { name: "FastAPI / Flask", level: "Proficient", iconName: "fastapi" },
        { name: "PyTorch / Scikit-Learn", level: "Proficient", iconName: "pytorch" },
        { name: "Tailwind CSS", level: "Advanced", iconName: "tailwind" },
        { name: "Docker & Containers", level: "Intermediate", iconName: "docker" }
      ]
    },
    {
      category: "Academic & Theoretical Foundations",
      icon: "book-open",
      items: [
        { name: "Data Structures & Algorithms", level: "Advanced", iconName: "dsa" },
        { name: "Object-Oriented Programming (OOP)", level: "Advanced", iconName: "oop" },
        { name: "Database Design & Normalization", level: "Advanced", iconName: "db" },
        { name: "Operating Systems & Concurrency", level: "Proficient", iconName: "os" },
        { name: "Distributed Systems Concepts", level: "Proficient", iconName: "dist" },
        { name: "Computer Networks & Protocols", level: "Proficient", iconName: "net" }
      ]
    },
    {
      category: "Tools, Cloud & DevOps",
      icon: "wrench",
      items: [
        { name: "Git & GitHub", level: "Advanced", iconName: "git" },
        { name: "Linux / Bash Shell", level: "Proficient", iconName: "linux" },
        { name: "Docker & Compose", level: "Intermediate", iconName: "docker" },
        { name: "Postman & API Testing", level: "Proficient", iconName: "postman" },
        { name: "AWS (S3, EC2 Basics)", level: "Intermediate", iconName: "aws" },
        { name: "CI / CD (GitHub Actions)", level: "Intermediate", iconName: "cicd" }
      ]
    }
  ],

  // Education Timeline
  education: [
    {
      institution: "State University of Science & Technology",
      degree: "Bachelor of Science in Computer Science",
      period: "2021 — 2025 (Expected)",
      gpa: "3.92 / 4.0",
      location: "New York, USA",
      honors: "Dean's List (All Semesters), Honors Program Scholar",
      coursework: [
        "Data Structures & Algorithms (CS 210)",
        "Operating Systems & Multi-Threading (CS 340)",
        "Database Systems & Schema Design (CS 330)",
        "Distributed Computing & Cloud (CS 450)",
        "Artificial Intelligence & Machine Learning (CS 470)",
        "Software Engineering Capstone (CS 490)"
      ]
    },
    {
      institution: "Northfield Science Academy",
      degree: "High School Diploma — STEM Magnet Specialization",
      period: "2017 — 2021",
      gpa: "4.0 / 4.0",
      location: "New York, USA",
      honors: "Valedictorian, National Merit Scholar",
      coursework: ["AP Computer Science A", "AP Calculus BC", "AP Physics C", "AP Statistics"]
    }
  ],

  // Certifications & Achievements
  certifications: [
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
      credentialUrl: "https://aws.amazon.com/verification",
      badge: "Verified"
    },
    {
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      date: "2023",
      credentialUrl: "https://coursera.org/verify/professional-cert",
      badge: "Honors"
    },
    {
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI / Andrew Ng",
      date: "2023",
      credentialUrl: "https://coursera.org/verify/specialization",
      badge: "Completed"
    }
  ]
};

// Expose globally for browser usage
if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
