  function toggleSidebar() {
        document.getElementById("sidebar").classList.toggle("open");
    }
    function toggleSolution(button) {
        let solution = button.nextElementSibling;

        if (solution.style.display === "block") {
            solution.style.display = "none";
        } else {
            solution.style.display = "block";
        }
    }

            function signup() {
            console.log("clicked");

            fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "Shivam",
                    email: "test@gmail.com",
                    password: "1234"
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    alert(data.message);
                })
                .catch(err => console.log(err));
        }

           const topBtn = document.getElementById("topBtn");

        window.onscroll = function () {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        };

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

          function toggleChatbot() {
            const box = document.getElementById("chatbotBox");
            box.style.display = box.style.display === "flex" ? "none" : "flex";
        }

        function handleEnter(event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        }

        function sendMessage() {
            const input = document.getElementById("userInput");
            const messages = document.getElementById("chatMessages");
            const userText = input.value.trim();

            if (userText === "") return;

            messages.innerHTML += `<div class="user-msg">${userText}</div>`;
            input.value = "";

            const reply = getBotReply(userText.toLowerCase());

            setTimeout(() => {
                messages.innerHTML += `<div class="bot-msg">${reply}</div>`;
                messages.scrollTop = messages.scrollHeight;
            }, 400);
        }

        function getBotReply(text) {

            if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
                return "Hello 👋 I am Access AI Assistant. You can ask me about Frontend, Backend, AI, Cybersecurity, projects, roadmap, resources, login/signup, dashboard, or deployment.";
            }

            if (text.includes("frontend") || text.includes("html") || text.includes("css") || text.includes("javascript")) {
                return "Frontend roadmap: HTML se structure banao, CSS se design karo, JavaScript se interactivity add karo. Phir responsive design, DOM manipulation, forms, API fetch, navbar, cards, dashboard aur real projects practice karo.";
            }

            if (text.includes("backend") || text.includes("node") || text.includes("express") || text.includes("mongodb")) {
                return "Backend roadmap: Node.js basics, Express server, routes, middleware, MongoDB connection, schema/model, signup-login APIs, bcrypt password hashing, JWT login session aur deployment sikho.";
            }

            if (text.includes("ai") || text.includes("artificial intelligence") || text.includes("machine learning")) {
                return "AI roadmap: Python se start karo, phir basic maths, NumPy, Pandas, data visualization, machine learning basics aur small projects jaise chatbot, spam detection, recommendation system banao.";
            }

            if (text.includes("cyber") || text.includes("security") || text.includes("hacking")) {
                return "Cybersecurity roadmap: Networking basics, Linux commands, web security, authentication, encryption, OWASP Top 10 aur safe practice labs se start karo.";
            }

            if (text.includes("project") || text.includes("mini project")) {
                return "Project ideas: Portfolio website, login/signup system, e-learning platform, quiz app, notes app, weather app, blog website, student dashboard, AI resource finder aur cybersecurity awareness website.";
            }

            if (text.includes("resource") || text.includes("course") || text.includes("youtube")) {
                return "Best learning method: Pehle beginner-friendly YouTube video dekho, phir notes banao, phir same topic ka mini project banao. Sirf video dekhne se coding strong nahi hoti.";
            }

            if (text.includes("roadmap") || text.includes("start")) {
                return "Best starting roadmap: 1) Ek field choose karo, 2) Basics sikho, 3) Small projects banao, 4) Frontend-backend connect karo, 5) Database add karo, 6) Deploy karo.";
            }

            if (text.includes("login") || text.includes("signup")) {
                return "Login/signup ke liye: frontend form banao, fetch() se backend API call karo, Express me route banao, MongoDB me user save karo, password bcrypt se hash karo aur JWT se login secure karo.";
            }

            if (text.includes("dashboard")) {
                return "Dashboard me user info, learning cards, continue learning section, saved resources, logout button aur recommended courses add karna best rahega.";
            }

            if (text.includes("deploy") || text.includes("hosting")) {
                return "Deployment ke liye: frontend Netlify/Vercel par, backend Render par, aur database MongoDB Atlas par host kar sakte ho.";
            }

            if (text.includes("thank")) {
                return "You're welcome 😊 Keep learning step by step and keep building projects.";
            }
        }