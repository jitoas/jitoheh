# دليل المحقق: استنتاج مسرح الجريمة (Detective Deduction Board Game)

لعبة استنتاج وتحقيق جنائي جماعية متعددة اللاعبين تعمل باللغة العربية عبر خادم Node.js وتطبيقات الويب المباشرة (Socket.IO + React + Express + Vite).

---

## 🚀 كيفية تشغيل المشروع محلياً (Local Development)

1. **تثبيت الحزم (Install Dependencies):**
   ```bash
   npm install
   ```

2. **التشغيل في وضع التطوير (Development):**
   ```bash
   npm run dev
   ```
   افتح المتصفح على: `http://localhost:3000`

3. **البناء والتجميع لإنتاج النسخة النهائية (Build for Production):**
   ```bash
   npm run build
   ```

4. **تشغيل الخادم في وضع الإنتاج (Start Production Server):**
   ```bash
   npm run start
   ```

---

## 🌐 النشر على Replit (Deploying on Replit)

1. أنشئ **Repl** جديداً من نوع **Node.js** أو اضبط استيراد المستودع.
2. تأكد من أن ملف `package.json` يتضمن أمر التشغيل والتطوير:
   - **Build Command:** `npm run build`
   - **Run Command:** `npm run start`
3. ستقوم منصة Replit بملء المنفذ تلقائياً عبر `process.env.PORT`.

---

## ☁️ النشر على Render (Deploying on Render)

1. أنشئ **Web Service** جديدة على Render.
2. ربط المستودع الخاص بك وانتقاء الإعدادات الآتية:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
3. سيقوم Render باكتشاف خادم Express وتشغيله مباشرة على المنفذ المطلوب.

---

## 📦 بنية الملفات الهامة (Project Structure)

- `server.ts`: خادم Express مع تكامل Socket.IO و Vite Middleware.
- `src/App.tsx`: الواجهة الرئيسية والتنقل بين مراحل اللعبة.
- `src/server/caseManager.ts`: إدارة منطق اللعبة والأدوار (القاتل، الشريك، الشاهد، الطبيب الشرعي، المهرج، المحققون).
- `src/data/weapons.ts`: قائمة أسلحة الجريمة مترجمة باللغة العربية.
- `src/data/evidence.ts`: قائمة أدلة مسرح الجريمة مترجمة باللغة العربية.
- `src/data/folders.ts`: مجلدات وقوائم أدلة الطبيب الشرعي.
- `src/data/events.ts`: الأحداث العشوائية في مسرح الجريمة.
