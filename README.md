
```markdown
# 🔗 ShortLink – Simple URL Shortener

A minimalist, self-hosted URL shortener built with Node.js, Express, and SQLite. Paste a long URL, get a short, shareable link instantly – with no tracking, no ads, and full privacy.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![SQLite](https://img.shields.io/badge/SQLite-3.x-lightblue)
---

## ✨ Features

- ⚡ **Instant** – Shorten URLs in under a second
- 🔒 **Private** – Your data stays on your server
- 📦 **Self-hosted** – Full control over your infrastructure
- 🌐 **No tracking** – No analytics, no cookies, no surveillance
- 🌙 **Light/Dark mode** – Toggle with one click, saved to localStorage
- 📋 **Auto-copy** – Short URLs copied to clipboard automatically
- ⌨️ **Keyboard shortcuts** – `Ctrl+Enter` to submit, `Esc` to clear input
- 🔢 **Character counter** – See URL length as you type
- 📱 **Fully responsive** – Works on mobile, tablet, and desktop
- 🎨 **Glassmorphism UI** – Modern, clean, and visually appealing

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yared2124/CodeAlpha_Simple_URL_Shortener.git

# Navigate to the project directory
cd CodeAlpha_Simple_URL_Shortener

# Install dependencies
npm install

# Start the server
node server.js
```

### Open in Browser

```
http://localhost:3000
```

---

## 📁 Project Structure

```
CodeAlpha_Simple_URL_Shortener/
├── public/
│   ├── index.html          # Main HTML page
│   ├── style.css           # Modern glassmorphism styles
│   └── script.js           # All client-side logic
├── src/
│   ├── config/
│   │   └── database.js     # SQLite connection & table setup
│   ├── models/
│   │   └── urlModel.js     # Database operations (save, find, exists)
│   ├── controllers/
│   │   └── urlController.js # Business logic (shorten, redirect)
│   └── routes/
│       └── urlRoutes.js    # API & redirect route definitions
├── server.js               # Express server entry point
├── package.json            # Dependencies & scripts
├── urls.db                 # SQLite database (auto-generated)
└── README.md               # This file
```

---

## 🛠️ API Endpoints

### POST /api/shorten
Shorten a long URL.

**Request:**
```json
{
  "longUrl": "https://example.com/very/long/path"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123"
}
```

### GET /:shortCode
Redirect to the original URL.

**Example:**
```
http://localhost:3000/abc123
→ Redirects to https://example.com/very/long/path
```

---

## 🧪 Testing with cURL

```bash
# Shorten a URL
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://google.com"}'

# Follow the redirect
curl -L http://localhost:3000/abc123
```

---

## 🎨 Frontend Features

| Feature | Description |
| :--- | :--- |
| **URL Input** | Smart field with auto-https, paste detection, and character counter |
| **Shorten Button** | Clear call-to-action with loading spinner |
| **Result Display** | Shows shortened URL with instant copy-to-clipboard |
| **Theme Toggle** | Switch between light and dark modes – preference saved |
| **Keyboard Shortcuts** | `Ctrl+Enter` to submit, `Esc` to clear input |
| **Responsive Design** | Adapts beautifully to any screen size |

---


## 🛠️ Technologies Used

- **Backend:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database:** [SQLite3](https://www.sqlite.org/)
- **Unique IDs:** [nanoid](https://github.com/ai/nanoid)
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Fonts:** [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

---

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "sqlite3": "^5.1.6",
  "nanoid": "^5.0.0"
}
```

---

## 🚀 Deployment

### Deploy to Render

1. Fork/clone this repository.
2. Create a new Web Service on [Render](https://render.com).
3. Connect your GitHub repository.
4. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Deploy and get your live URL.

## 🐛 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| `Error: Cannot find module` | Run `npm install` |
| `Port 3000 already in use` | Change `PORT` in `server.js` or use `PORT=3001 npm start` |
| `SQLITE_ERROR: no such table: urls` | Delete `urls.db` and restart – the table will be recreated |
| `Empty response from server` | Make sure you're opening `http://localhost:3000`, not the file path |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---



## 👨‍💻 Author

**Yared Aregayehu**

- GitHub: [@yared2124](https://github.com/yared2124)
- LinkedIn: [Yared Aregayehu](https://www.linkedin.com/in/yared-yared-326148375)

---

## 🙏 Acknowledgments

- Built as a learning project for URL shortening basics.
- Inspired by the need for a simple, self-hosted alternative to commercial URL shorteners.

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!
