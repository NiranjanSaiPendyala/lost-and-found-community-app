🕵️‍♂️ Secure Lost & Found Portal
A centralized, AI-powered platform designed to streamline the lost and found process for colleges, leveraging Google's Gemini AI for automation and security.

🚩 The Problem
Existing systems like notice boards or WhatsApp groups are chaotic, unsearchable, and lack verification. Students risk fraud or safety issues by meeting strangers to recover items.

💡 The Solution
Our solution bridges the digital and physical world using a secure, verified workflow:

AI-Powered Reporting: Finders scan items with Gemini Vision to auto-fill details (No manual typing!).
Blind Verification: A "Zero-Knowledge" proof system where the AI validates ownership claims without revealing hidden item details publicly.
Digital Gate Pass: A secure, one-time code generated for the physical handover at the Admin Desk.
🌟 Key Features
🔐 Domain-Locked Security: Restricted strictly to @iare.ac.in emails.
🤖 Gemini Vision Integration: Detects object type, brand, and color from photos instantly.
⚖️ AI Judge: Using Gemini 1.5 Flash to compare "Hidden Details" vs. "Client Proof" for fraud prevention.
🎫 Digital Audit Trail: Generates a unique pickup code to ensure accountability during handover.
📱 Real-Time Dashboard: Live feed of Lost & Found items with smart search.
🛠️ Tech Stack (Google Ecosystem)
Frontend: React.js + Vite + Tailwind CSS (Glassmorphism UI)
Auth: Firebase Authentication (Identity Platform)
Database: Cloud Firestore (Real-time NoSQL)
Storage: Cloud Storage for Firebase (Image Hosting)
AI: Google Gemini Pro Vision & Gemini 1.5 Flash (via Cloud Functions)
Backend: Google Cloud Functions (Serverless Node.js)
🚀 Future Roadmap
Semantic Search: "Find me a bottle with a superhero sticker" (Vector Embeddings).
Gamification: Reputation points & canteen coupons for honest finders.
Geo-Fencing: Location-based alerts for lost items nearby.
📸 Snapshots
(Add your screenshots here)

💻 How to Run Locally
Clone the Repository

git clone <your-repo-link>
cd client
Install Dependencies

npm install
Configure Environment

Create a .env file in the client folder.
Add your Firebase config keys (API_KEY, AUTH_DOMAIN, etc.).
Start the App

npm run dev
🔗 Live Demo
https://lost-and-found-portal-540b9.web.app
