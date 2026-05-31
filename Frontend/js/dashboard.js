const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "02-login.html";
}

const userName = localStorage.getItem("userName") || "Student";
const userEmail = localStorage.getItem("userEmail") || "student@gmail.com";

document.getElementById("username").innerText = userName;
document.getElementById("email").innerText = userEmail;

document.getElementById("avatar").innerText =
  userName.charAt(0).toUpperCase();

  let totalLessons = 100;

let completedLessons =
  Number(localStorage.getItem("completedLessons")) || 0;

function updateProgress() {

  if (completedLessons > totalLessons) {
    completedLessons = totalLessons;
  }

  let remainingLessons =
    totalLessons - completedLessons;

  let progressPercent =
    Math.round((completedLessons / totalLessons) * 100);

  document.getElementById("completedLessons").innerText =
    completedLessons;

  document.getElementById("remainingLessons").innerText =
    remainingLessons;

  document.getElementById("progressPercent").innerText =
    progressPercent + "%";

  document.getElementById("progressFill").style.width =
    progressPercent + "%";

  localStorage.setItem(
    "completedLessons",
    completedLessons
  );
}

function completeLesson() {

  if (completedLessons < totalLessons) {

    completedLessons++;

    updateProgress();

  } else {

    alert("All lessons completed");
  }
}

function resetProgress() {

  completedLessons = 0;

  localStorage.setItem(
    "completedLessons",
    completedLessons
  );

  updateProgress();
}

const techCategories = [
  {
    category: "AI & Machine Learning",
    items: [
      ["ChatGPT", "Use AI for coding, study and productivity.", "https://chatgpt.com", "fa-solid fa-robot"],
      ["Machine Learning", "Learn ML from beginner to advanced.", "https://www.coursera.org/learn/machine-learning", "fa-solid fa-brain"],
      ["Deep Learning", "Neural networks and AI models.", "https://www.deeplearning.ai", "fa-solid fa-microchip"],
      ["Hugging Face", "NLP, transformers and AI models.", "https://huggingface.co/learn", "fa-solid fa-language"],
      ["Prompt Engineering", "Learn better AI prompting.", "https://learnprompting.org", "fa-solid fa-wand-magic-sparkles"],
      ["Google AI", "AI learning resources from Google.", "https://ai.google/education/", "fa-brands fa-google"],
      ["Kaggle ML", "Practice ML with datasets.", "https://www.kaggle.com/learn", "fa-solid fa-database"],
      ["OpenAI Docs", "Build with AI APIs.", "https://platform.openai.com/docs", "fa-solid fa-code"],
      ["Fast.ai", "Practical deep learning.", "https://www.fast.ai", "fa-solid fa-bolt"],
      ["TensorFlow", "ML framework by Google.", "https://www.tensorflow.org/learn", "fa-solid fa-network-wired"]
    ]
  },
  {
    category: "Web Development",
    items: [
      ["MDN Web Docs", "Best HTML, CSS and JS docs.", "https://developer.mozilla.org", "fa-brands fa-html5"],
      ["Frontend Mentor", "Practice frontend projects.", "https://www.frontendmentor.io", "fa-solid fa-laptop-code"],
      ["React", "Official React learning docs.", "https://react.dev/learn", "fa-brands fa-react"],
      ["JavaScript Info", "Modern JavaScript guide.", "https://javascript.info", "fa-brands fa-js"],
      ["Node.js", "Backend JavaScript runtime.", "https://nodejs.org/en/learn", "fa-brands fa-node-js"],
      ["Express.js", "Backend framework for Node.", "https://expressjs.com", "fa-solid fa-server"],
      ["MongoDB University", "Learn MongoDB properly.", "https://learn.mongodb.com", "fa-solid fa-database"],
      ["Full Stack Open", "Full stack web course.", "https://fullstackopen.com/en/", "fa-solid fa-globe"],
      ["Next.js", "React framework for production.", "https://nextjs.org/learn", "fa-solid fa-layer-group"],
      ["Tailwind CSS", "Modern CSS framework.", "https://tailwindcss.com/docs", "fa-solid fa-wind"]
    ]
  },
  {
    category: "Programming Languages",
    items: [
      ["Python", "Python beginner tutorials.", "https://www.w3schools.com/python/", "fa-brands fa-python"],
      ["Java", "Java tutorials and examples.", "https://www.geeksforgeeks.org/java/", "fa-brands fa-java"],
      ["C++", "C++ reference and basics.", "https://cplusplus.com", "fa-solid fa-code"],
      ["JavaScript", "Deep JS learning.", "https://javascript.info", "fa-brands fa-js"],
      ["TypeScript", "Official TypeScript docs.", "https://www.typescriptlang.org/docs/", "fa-solid fa-code"],
      ["C Programming", "Learn C basics.", "https://www.programiz.com/c-programming", "fa-solid fa-terminal"],
      ["Go Language", "Official Go learning.", "https://go.dev/learn/", "fa-solid fa-code"],
      ["Rust", "Official Rust book.", "https://doc.rust-lang.org/book/", "fa-solid fa-shield"],
      ["SQL", "Practice SQL queries.", "https://www.w3schools.com/sql/", "fa-solid fa-database"],
      ["Bash", "Linux shell scripting.", "https://linuxjourney.com", "fa-brands fa-linux"]
    ]
  },
  {
    category: "Coding Practice & DSA",
    items: [
      ["LeetCode", "Coding interview practice.", "https://leetcode.com", "fa-solid fa-laptop-code"],
      ["HackerRank", "Coding and SQL practice.", "https://www.hackerrank.com", "fa-solid fa-code"],
      ["Codeforces", "Competitive programming.", "https://codeforces.com", "fa-solid fa-trophy"],
      ["CodeChef", "Coding contests.", "https://www.codechef.com", "fa-solid fa-ranking-star"],
      ["GeeksforGeeks DSA", "DSA tutorials and problems.", "https://www.geeksforgeeks.org/data-structures/", "fa-solid fa-brain"],
      ["NeetCode", "DSA roadmap and videos.", "https://neetcode.io", "fa-solid fa-route"],
      ["CP Algorithms", "Algorithms explanations.", "https://cp-algorithms.com", "fa-solid fa-sitemap"],
      ["InterviewBit", "Interview preparation.", "https://www.interviewbit.com", "fa-solid fa-user-tie"],
      ["Exercism", "Practice programming languages.", "https://exercism.org", "fa-solid fa-dumbbell"],
      ["Project Euler", "Math + programming problems.", "https://projecteuler.net", "fa-solid fa-calculator"]
    ]
  },
  {
    category: "Career, Internships & Jobs",
    items: [
      ["Internshala", "Find internships in India.", "https://internshala.com", "fa-solid fa-briefcase"],
      ["LinkedIn Jobs", "Apply for jobs and internships.", "https://www.linkedin.com/jobs", "fa-brands fa-linkedin"],
      ["Unstop", "Competitions and internships.", "https://unstop.com", "fa-solid fa-award"],
      ["Wellfound", "Startup jobs and internships.", "https://wellfound.com", "fa-solid fa-rocket"],
      ["Forage", "Virtual job simulations.", "https://www.theforage.com", "fa-solid fa-laptop"],
      ["Canva Resume", "Create resumes easily.", "https://www.canva.com/resumes/", "fa-solid fa-file-lines"],
      ["Novoresume", "Resume builder.", "https://novoresume.com", "fa-solid fa-file-circle-check"],
      ["Pramp", "Mock interview practice.", "https://www.pramp.com", "fa-solid fa-comments"],
      ["Glassdoor", "Company reviews and salaries.", "https://www.glassdoor.co.in", "fa-solid fa-building"],
      ["Naukri", "Indian job portal.", "https://www.naukri.com", "fa-solid fa-briefcase"]
    ]
  },
  {
    category: "DevOps, Cloud & Deployment",
    items: [
      ["Docker", "Official Docker docs.", "https://docs.docker.com", "fa-brands fa-docker"],
      ["Kubernetes", "Container orchestration.", "https://kubernetes.io/docs/home/", "fa-solid fa-network-wired"],
      ["AWS Training", "Learn cloud fundamentals.", "https://aws.amazon.com/training/", "fa-brands fa-aws"],
      ["Google Cloud Skills", "Cloud learning by Google.", "https://www.cloudskillsboost.google", "fa-brands fa-google"],
      ["Azure Learn", "Microsoft cloud learning.", "https://learn.microsoft.com/en-us/training/azure/", "fa-brands fa-microsoft"],
      ["GitHub Actions", "CI/CD automation.", "https://docs.github.com/en/actions", "fa-brands fa-github"],
      ["Vercel", "Deploy frontend apps.", "https://vercel.com/docs", "fa-solid fa-cloud-arrow-up"],
      ["Netlify", "Deploy static websites.", "https://docs.netlify.com", "fa-solid fa-globe"],
      ["Render", "Deploy backend servers.", "https://render.com/docs", "fa-solid fa-server"],
      ["Railway", "Deploy full stack apps.", "https://docs.railway.app", "fa-solid fa-train"]
    ]
  },
  {
    category: "Data Science & Analytics",
    items: [
      ["Kaggle", "Datasets and notebooks.", "https://www.kaggle.com/learn", "fa-solid fa-database"],
      ["Pandas", "Data analysis in Python.", "https://pandas.pydata.org/docs/", "fa-solid fa-table"],
      ["NumPy", "Numerical computing.", "https://numpy.org/learn/", "fa-solid fa-calculator"],
      ["Matplotlib", "Data visualization.", "https://matplotlib.org/stable/tutorials/index.html", "fa-solid fa-chart-line"],
      ["Power BI", "Business intelligence tool.", "https://learn.microsoft.com/en-us/power-bi/", "fa-solid fa-chart-pie"],
      ["Tableau", "Data visualization platform.", "https://www.tableau.com/learn", "fa-solid fa-chart-simple"],
      ["Google Data Analytics", "Career certificate.", "https://www.coursera.org/professional-certificates/google-data-analytics", "fa-brands fa-google"],
      ["SQLBolt", "Interactive SQL practice.", "https://sqlbolt.com", "fa-solid fa-terminal"],
      ["Mode SQL", "SQL tutorials.", "https://mode.com/sql-tutorial/", "fa-solid fa-database"],
      ["DataCamp", "Data skill courses.", "https://www.datacamp.com", "fa-solid fa-chart-column"]
    ]
  },
  {
    category: "Cybersecurity & Networking",
    items: [
      ["TryHackMe", "Beginner cyber labs.", "https://tryhackme.com", "fa-solid fa-shield-halved"],
      ["OverTheWire", "Linux security games.", "https://overthewire.org/wargames/", "fa-solid fa-terminal"],
      ["Cisco Networking", "Networking basics.", "https://skillsforall.com", "fa-solid fa-wifi"],
      ["Cloudflare Learning", "Internet and security basics.", "https://www.cloudflare.com/learning/", "fa-solid fa-cloud"],
      ["OWASP", "Web security knowledge.", "https://owasp.org/www-project-top-ten/", "fa-solid fa-bug"],
      ["PortSwigger Academy", "Web security training.", "https://portswigger.net/web-security", "fa-solid fa-lock"],
      ["CompTIA", "IT and security basics.", "https://www.comptia.org/content/it-careers-path-roadmap", "fa-solid fa-road"],
      ["Google Cybersecurity", "Beginner cybersecurity course.", "https://www.coursera.org/professional-certificates/google-cybersecurity", "fa-brands fa-google"],
      ["Wireshark Docs", "Network packet analysis.", "https://www.wireshark.org/docs/", "fa-solid fa-network-wired"],
      ["MDN Security", "Web security basics.", "https://developer.mozilla.org/en-US/docs/Web/Security", "fa-solid fa-globe"]
    ]
  },
  {
    category: "Design, UI/UX & Productivity",
    items: [
      ["Figma Learn", "UI/UX design tool.", "https://help.figma.com/hc/en-us/categories/360002051613-Learn-design", "fa-brands fa-figma"],
      ["Dribbble", "Design inspiration.", "https://dribbble.com", "fa-solid fa-palette"],
      ["Behance", "Portfolio inspiration.", "https://www.behance.net", "fa-brands fa-behance"],
      ["Canva", "Design and presentations.", "https://www.canva.com", "fa-solid fa-pen-nib"],
      ["Notion", "Notes and planning.", "https://www.notion.so", "fa-solid fa-note-sticky"],
      ["Trello", "Task management.", "https://trello.com", "fa-brands fa-trello"],
      ["Google Fonts", "Free fonts for websites.", "https://fonts.google.com", "fa-solid fa-font"],
      ["Coolors", "Color palettes.", "https://coolors.co", "fa-solid fa-fill-drip"],
      ["Unsplash", "Free images.", "https://unsplash.com", "fa-solid fa-image"],
      ["Lucide Icons", "Clean web icons.", "https://lucide.dev", "fa-solid fa-icons"]
    ]
  },
  {
    category: "Projects, Open Source & Portfolio",
    items: [
      ["GitHub", "Host and share projects.", "https://github.com", "fa-brands fa-github"],
      ["GitHub Skills", "Learn GitHub by doing.", "https://skills.github.com", "fa-brands fa-github-alt"],
      ["First Contributions", "Start open source.", "https://github.com/firstcontributions/first-contributions", "fa-solid fa-code-branch"],
      ["Good First Issue", "Find beginner open-source issues.", "https://goodfirstissue.dev", "fa-solid fa-magnifying-glass"],
      ["Dev.to", "Write tech blogs.", "https://dev.to", "fa-brands fa-dev"],
      ["Hashnode", "Developer blogging.", "https://hashnode.com", "fa-brands fa-hashnode"],
      ["Roadmap.sh Projects", "Practice projects.", "https://roadmap.sh/projects", "fa-solid fa-folder-tree"],
      ["FreeCodeCamp Projects", "Build portfolio projects.", "https://www.freecodecamp.org/learn", "fa-brands fa-free-code-camp"],
      ["Replit", "Build projects online.", "https://replit.com", "fa-solid fa-laptop"],
      ["CodePen", "Frontend experiments.", "https://codepen.io", "fa-brands fa-codepen"]
    ]
  }
];

function renderTechCategories() {
  const container = document.getElementById("techCategories");
  if (!container) return;

  container.innerHTML = techCategories.map(section => `
    <section class="category-section">
      <div class="category-heading">
        <h2>${section.category}</h2>
      </div>

      <div class="mega-grid">
        ${section.items.map(item => `
          <div class="mega-card">
            <i class="${item[3]}"></i>
            <h3>${item[0]}</h3>
            <p>${item[1]}</p>
            <a href="${item[2]}" target="_blank">Open</a>
          </div>
        `).join("")}
      </div>
    </section>
  `).join("");
}
function trackLearningClick() {

  const learningLinks =
    document.querySelectorAll(
      ".card a, .mega-card a, .extra-card a, .project-card a"
    );

  learningLinks.forEach(link => {

    link.addEventListener("click", function () {

      if (completedLessons < totalLessons) {

        completedLessons++;

        updateProgress();
      }
    });
  });
}

function loadProfile() {
  fetch("/api/profile", {
    headers: {
      "Authorization": token
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success === true) {
      const name = data.user.name;
      const email = data.user.email;

      document.getElementById("username").innerText = name;
      document.getElementById("email").innerText = email;
      document.getElementById("avatar").innerText = name.charAt(0).toUpperCase();

      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
    } else {
      alert(data.message);
      logout();
    }
  })
  .catch(err => {
    alert("Backend is not connected");
    console.log(err);
  });
}

function loadProgress() {
  fetch("/api/progress", {
    headers: {
      "Authorization": token
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success === true) {
      updateProgressUI(data.completedLessons, data.totalLessons);
    } else {
      alert(data.message);
    }
  })
  .catch(err => {
    console.log(err);
  });
}

function completeLesson() {
  fetch("/api/complete-lesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);

    if (data.success === true) {
      updateProgressUI(data.completedLessons, data.totalLessons);
    }
  })
  .catch(err => {
    alert("Lesson progress not updated");
    console.log(err);
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");

  window.location.href = "02-login.html";
}

loadProfile();
loadProgress();

updateProgress();

renderTechCategories();

trackLearningClick();

const goTopBtn = document.getElementById("goTopBtn");

window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    goTopBtn.style.display = "block";
  } else {
    goTopBtn.style.display = "none";
  }
});

function goToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}