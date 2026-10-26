/**
 * =========================================================================
 * EdMissions Assessment: Live Master Spreadsheet & GitHub Auto-Sync Script
 * =========================================================================
 * 
 * Instructions to set up your Live Master Spreadsheet:
 * 1. Open Google Sheets (https://sheets.new) and name it "EdMissions Quiz Submissions".
 * 2. In the top menu, go to: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire script, and click Save (Ctrl+S).
 * 4. Click the blue "Deploy" button (top-right) > "New deployment".
 * 5. Under "Select type" (gear icon), select "Web app".
 * 6. Set Description: "EdMissions Quiz Webhook"
 * 7. Set "Execute as": "Me (your email)"
 * 8. Set "Who has access": "Anyone"  <-- CRITICAL!
 * 9. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * 10. Paste that Web App URL into your assessment website (under Admin > Cloud Integrations) 
 *     or in quiz-data.js under `webhookUrl`.
 */

// Configuration for GitHub auto-commit
const GITHUB_REPO_OWNER = "SukantaJeet";
const GITHUB_REPO_NAME = "readiness-assessment";
// Add your GitHub Personal Access Token here if you want Google Apps Script to auto-commit directly to GitHub:
const GITHUB_PERSONAL_ACCESS_TOKEN = ""; // e.g. "ghp_..."

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // If new sheet, write the master header columns
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Student Full Name",
        "Grade / Class",
        "Contact Number",
        "Email Address",
        "Test Duration",
        "Total Score (/30)",
        "Percentage",
        "Readiness Tier",
        "General Aptitude (/10)",
        "English Readiness (/10)",
        "Math Readiness (/10)"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Append student row to the Live Master Spreadsheet
    sheet.appendRow([
      new Date(),
      data.student.name || "N/A",
      data.student.grade || "N/A",
      data.student.contact || "N/A",
      data.student.email || "N/A",
      data.durationStr || "N/A",
      (data.overallScore ?? 0) + " / 30",
      (data.percentScore ?? 0) + "%",
      data.performanceTier || "N/A",
      (data.sectionScores?.aptitude?.score ?? 0) + " / 10",
      (data.sectionScores?.english?.score ?? 0) + " / 10",
      (data.sectionScores?.math?.score ?? 0) + " / 10"
    ]);

    // Optional: Auto-commit report to GitHub `submissions/` folder if token configured
    if (GITHUB_PERSONAL_ACCESS_TOKEN) {
      commitReportToGitHub(data);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function commitReportToGitHub(data) {
  try {
    const safeName = (data.student.name || "Student").replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd_HH-mm-ss");
    const filename = `submissions/${safeName}_${timestamp}.json`;

    const jsonString = JSON.stringify(data, null, 2);
    const contentBase64 = Utilities.base64Encode(jsonString, Utilities.Charset.UTF_8);

    const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filename}`;
    const options = {
      method: "PUT",
      headers: {
        "Authorization": "token " + GITHUB_PERSONAL_ACCESS_TOKEN,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Google-Apps-Script-EdMissions"
      },
      payload: JSON.stringify({
        message: `Add submission report for ${data.student.name}`,
        content: contentBase64,
        branch: "main"
      }),
      muteHttpExceptions: true
    };

    UrlFetchApp.fetch(url, options);
  } catch (err) {
    Logger.log("GitHub commit failed: " + err.toString());
  }
}
