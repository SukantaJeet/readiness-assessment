# Student Discovery & Readiness Assessment (EdMissions)
### Static Quiz Web Application with Excel (.xlsx) Export & Score Analytics

A modern, responsive, high-performance static web application built for the **EdMissions Student Discovery & Readiness Assessment**.

---

## 📋 Google Form Extraction Summary

We successfully accessed and analyzed the form:  
`https://docs.google.com/forms/d/1SETUnCaxxYJdxosQUYh8icmSmrqs2ftxqdqJmqhWzyE/edit?ts=6ade03e3`

- **Assessment Title**: *Student Discovery & Readiness Assessment*
- **Organization**: EdMissions ("Imagine. Build. Become.")
- **Total Questions**: 30 questions divided evenly across 3 sections:
  1. **General Aptitude** (10 questions: analogies, number patterns, word problems, rotations, matrix logic)
  2. **English Readiness** (10 questions: reading comprehension, vocabulary in context, subject-verb agreement, transitions, punctuation)
  3. **Math Readiness** (10 questions: linear models, circle geometry, inequalities, systems of equations, algebra, quadratic vertex, decay, rational expressions)
- **Candidate Registration Fields**: Full Name, Current Grade, Contact Phone, and Email.

---

## 🚀 How to Host on GitHub (GitHub Pages)

This project consists of 100% static files (`index.html`, `style.css`, `quiz-data.js`, `app.js`) with zero build step required.

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com) and click **New Repository**.
2. Name your repository (e.g., `readiness-assessment` or `edmissions-quiz`).
3. Set the repository to **Public** (required for free GitHub Pages).

### Step 2: Upload or Push the Project Files
From your local terminal inside this directory:
```bash
git init
git add .
git commit -m "Initial commit of EdMissions Quiz website"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```
*(Alternatively, drag and drop `index.html`, `style.css`, `quiz-data.js`, and `app.js` directly onto the GitHub web interface).*

### Step 3: Enable GitHub Pages
1. Go to your repository **Settings** tab on GitHub.
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Choose Branch: `main` and Folder: `/ (root)`.
5. Click **Save**.
6. In 1–2 minutes, your website will be live at:
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## 📊 Understanding "Saving in an Excel File in the Server at GitHub"

Because **GitHub Pages is a static web hosting service**, it serves static HTML, CSS, and JS files. There is no active server backend (like Node.js, PHP, or Python) running on GitHub Pages to accept incoming web forms and write directly to files in the repository.

To solve this, this application provides **3 elegant, production-ready solutions**:

### 1. Instant Automated Client-Side Excel (.xlsx) Download (Included & Pre-Built)
- As soon as a student completes the test, the application automatically calculates the score and generates an official Microsoft Excel file (`.xlsx`) using SheetJS.
- The generated Excel file contains:
  - **Sheet 1: Summary Report**: Candidate details, test timestamp, total score, percentage score, performance tier, and section-by-section breakdown.
  - **Sheet 2: Question Details**: Complete itemized table with every question, student's selected choice, correct answer, status (CORRECT/INCORRECT), and detailed explanation.

### 2. Built-in Admin Portal & Master Excel Exporter (Included & Pre-Built)
- Every completed assessment is automatically stored in the browser's persistent database (`localStorage`).
- Click the **📁 Submissions** button in the header at any time to open the Admin Records window.
- View all candidates and click **📥 Export All Submissions to Master Excel (.xlsx)** to download a single consolidated master spreadsheet with all test-takers' records!

### 3. Real-Time Remote Google Sheet / Excel Webhook (Free & Serverless)
If you want every test submission from all across the internet to automatically append to a live Google Sheet (which can be synced to Excel) with zero server setup:
1. Open [Google Sheets](https://sheets.new) and create a new sheet.
2. In the top menu, go to **Extensions > Apps Script**.
3. Paste the following script:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.student.name,
    data.student.grade,
    data.student.contact,
    data.student.email || 'N/A',
    data.durationStr,
    data.overallScore + ' / 30',
    data.percentScore + '%',
    data.performanceTier,
    data.sectionScores.aptitude.score + ' / 10',
    data.sectionScores.english.score + ' / 10',
    data.sectionScores.math.score + ' / 10'
  ]);
  return ContentService.createTextOutput(JSON.stringify({result: "success"})).setMimeType(ContentService.MimeType.JSON);
}
```
4. Click **Deploy > New deployment**, select **Web app**, set **Who has access** to **Anyone**, and click **Deploy**.
5. Copy the generated Web App URL and paste it into `quiz-data.js` under `QUIZ_CONFIG.webhookUrl`:
```javascript
const QUIZ_CONFIG = {
  ...
  webhookUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
};
```
Now every student submission will automatically record in your spreadsheet in real time!

---

## 🛠 Project Structure

```
edmissions-quiz-website/
├── index.html        # Main HTML layout, views, modals, and templates
├── style.css         # Modern, responsive styling with clean UI components
├── quiz-data.js      # Complete 30-question dataset with verified answers & explanations
├── app.js            # Quiz engine, timer, scoring, Excel generation & storage
└── README.md         # Deployment & documentation guide
```

---

## 🧪 Testing Locally

To preview and test the website locally on your computer:
1. Double-click `index.html` in your file explorer, OR
2. In your terminal inside this folder:
   ```powershell
   python -m http.server 8000
   ```
   and open `http://localhost:8000` in your browser.
