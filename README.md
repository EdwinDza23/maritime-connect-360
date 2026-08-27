# MC360 Maritime Intelligence Platform — Frontend Architecture

Welcome to the **MC360** enterprise frontend repository. This project is structured as a high-performance, modular, and scalable multi-product web application designed for maritime fleet operations.

---

## 📁 Directory & File Architecture

```
Landing page v5/
├── index.html                           # Root Landing Page (Semantic HTML5)
├── README.md                            # Architecture & Developer Documentation
├── css/
│   └── styles.css                       # Master stylesheet (tokens, layout, components, BQS)
├── js/
│   └── main.js                          # Core JavaScript (nav, animations, interactive cards, modals)
├── assets/
│   ├── images/                          # Product screenshots & landing page assets
│   │   ├── landingpagedashboard.png
│   │   └── bqs/                         # BQS module interface captures
│   │       ├── Create survey.png
│   │       ├── Master Details.png
│   │       ├── Ongoing serveys.png
│   │       ├── Prelim report survey.png
│   │       └── Published Surveys.png
│   ├── icons/                           # Standalone SVG icons directory
│   ├── logos/                           # MC360 brand logos & client partner logos (1.png - 8.png)
│   ├── illustrations/                   # Product vector illustrations
│   ├── videos/                          # Video walkthroughs & product demos
│   │   └── bqs/                         # BQS video walkthroughs
│   │       ├── BQSWalkthrough.mp4
│   │       └── BQSdemovideo.mp4
│   └── fonts/                           # Custom local web font files
├── products/                            # Product Modules Architecture
│   ├── bqs/                             # Bunker Quantity Survey Module
│   │   └── index.html
│   ├── vis/                             # Vessel Inspection System (Placeholder)
│   │   └── index.html
│   ├── vcs/                             # Vessel Condition Survey (Placeholder)
│   │   └── index.html
│   └── gs/                              # Global Sanctions & Guidance System (Placeholder)
│       └── index.html
├── docs/                                # Technical & Product Documentation
│   ├── application-docs/                # PDF specifications and Markdown documentation
│   │   ├── BQS.MD / BQS.pdf
│   │   ├── VCS.MD / VCS.pdf
│   │   └── VIA.MD / VIA.pdf
│   └── reference/                       # Design system and master guides
│       ├── MC360_Design_System.md
│       └── MC360_Master_Guide.md
└── archive/                             # Preserved Backups & External Templates
    ├── reference-html/                  # Reference templates & source HTML
    └── backup/                          # Full pre-refactoring HTML backups
```

---

## 🛠️ Key Architectural Design Principles

1. **Separation of Concerns**: HTML structure, CSS styling, and JavaScript logic are completely decoupled into `index.html`, `css/styles.css`, and `js/main.js`.
2. **Modular Product Routing**: Every product resides in its dedicated directory inside `products/` (e.g. `products/bqs/`, `products/vis/`).
3. **Asset Isolation**: Assets are categorized cleanly by type (`images/`, `logos/`, `videos/`, `icons/`, `illustrations/`, `fonts/`) under `assets/`.
4. **Zero Asset Breakage**: All image and video source paths are referenced with relative path precision.
5. **Future Scalability**: Adding a new product module or page requires simply adding a folder inside `products/` or at the root level using standard relative asset and stylesheet references.

---

## 🚀 Running locally

Since this project uses modern native ES features and video streaming, it can be served using any standard static Web Server:

```bash
# Using Node.js npx http-server
npx http-server ./ -p 8080

# Or using Python 3
python -m http.server 8080
```

Open `http://localhost:8080` in your web browser.
