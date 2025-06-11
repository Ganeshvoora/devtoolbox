# DevToolbox

A modern, full-featured developer toolbox web app built with Next.js, React, TypeScript, Tailwind CSS, Prisma, and NextAuth.js. DevToolbox provides a suite of essential utilities for developers, all in one place, with a beautiful UI and seamless authentication.

---

## 🚀 Features

- **API Tester**: Test REST APIs with custom methods, headers, and body.
- **Code Explain**: Paste code and get AI-powered explanations.
- **Code Preview**: Render and preview code snippets in various languages.
- **Color Picker**: Select, copy, and convert colors (HEX, RGB, HSL).
- **Hash Generator**: Generate hashes (MD5, SHA1, SHA256, etc.) for any input.
- **UUID Generator**: Instantly generate UUIDs (v1, v4).
- **Markdown Preview**: Live preview and edit Markdown documents.
- **JSON Formatter**: Format, validate, and beautify JSON data.
- **Password Generator**: Create strong, customizable passwords.
- **QR Code Generator**: Generate QR codes for any text or URL.
- **Resource Finder**: Discover curated developer resources by category.
- **News**: Stay updated with the latest developer news by topic.
- **Authentication**: Secure signup/signin with NextAuth.js and Prisma.
- **Command Palette**: Quick navigation and tool search (CMD/CTRL+K).
- **Personalized Home**: Greeting, quick search, and feature highlights.
- **Contact Section**: Styled contact form and info for feedback/support.
- **Responsive UI**: Mobile-friendly, dark mode, smooth animations (Framer Motion).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL (or SQLite for dev)
- **Authentication**: NextAuth.js (with Prisma adapter)
- **Validation**: Zod
- **Other**: ESLint, Prettier

---

## 📦 Project Structure

```
app/
  page.tsx                # Homepage
  tools/                  # All tool pages (see below)
    apitester/
    code-explain/
    code-preview/
    color-picker/
    hash-generator/
    json-formatter/
    markdown/
    password-generator/
    qrcode/
    resoursefinder/
    uuid-generator/
  news/                   # News page
  signin/, signup/        # Auth pages
  api/auth/               # NextAuth & signup API
components/               # Navbar, CMD, Footer, etc.
lib/                      # Auth config, Prisma connection
prisma/                   # Prisma schema
public/                   # Static assets
README.md                 # This file
```

---

## 🏁 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd devtoolbox
npm install
```

### 2. Configure Environment

- Copy `.env.example` to `.env` and fill in your database and NextAuth secrets.
- Example for SQLite (dev):
  ```env
  DATABASE_URL="file:./dev.db"
  NEXTAUTH_SECRET=your-secret
  NEXTAUTH_URL=http://localhost:3000
  ```

### 3. Setup Database

```bash
npx prisma migrate dev --name init
```

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧩 Adding/Editing Tools

- Each tool is a folder in `app/tools/` with its own `page.tsx`.
- Add new tools by creating a new folder and page.
- Update navigation in `components/Navbar.tsx` and `components/CMD.tsx` if needed.

---

## 🤝 Contributing

1. Fork the repo and create a new branch.
2. Make your changes (code, docs, UI, etc.).
3. Run `npm run lint` and `npm run format` to ensure code quality.
4. Submit a pull request with a clear description.

---

## 📄 License

MIT

---

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

## 💬 Contact & Feedback

- Use the contact form on the homepage or email: [your@email.com]
- Issues and feature requests: [GitHub Issues](https://github.com/your-repo/issues)

---

Enjoy using DevToolbox! 🚀
