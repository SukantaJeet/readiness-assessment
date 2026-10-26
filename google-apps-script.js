/**
 * =========================================================================
 * EdMissions Assessment: Live Master Spreadsheet & GitHub Auto-Sync Script
 * =========================================================================
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/19a3sTrty1Gjp7193jlftekkRJThnP8fm_9pL9KNB_nA/edit
 * GitHub Repository:   https://github.com/SukantaJeet/readiness-assessment
 *
 * -------------------------------------------------------------------------
 * EASY 1-MINUTE SETUP INSTRUCTIONS:
 * -------------------------------------------------------------------------
 * 1. Open your Google Sheet: 
 *    https://docs.google.com/spreadsheets/d/19a3sTrty1Gjp7193jlftekkRJThnP8fm_9pL9KNB_nA/edit
 * 2. In the top menu, click: Extensions > Apps Script
 * 3. Delete any default code in the editor, and paste this entire code.
 * 4. Click the Save icon (or Ctrl+S).
 * 5. Click the blue "Deploy" button (top right) > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Set Description: "EdMissions Quiz Webhook"
 * 8. Set "Execute as": "Me (csukanta.1995@gmail.com)"
 * 9. Set "Who has access": "Anyone"  <--- (IMPORTANT! Must be Anyone so students can submit)
 * 10. Click "Deploy", approve Google permissions when prompted, and copy the "Web app URL".
 * 11. Send that Web app URL here! We will link it to your website so everything is 100% automated.
 */

const SPREADSHEET_ID = "19a3sTrty1Gjp7193jlftekkRJThnP8fm_9pL9KNB_nA";
const GITHUB_REPO_OWNER = "SukantaJeet";
const GITHUB_REPO_NAME = "readiness-assessment";
// Optional: paste your GitHub Personal Access Token inside the quotes below if you want automatic commits to GitHub:
const GITHUB_PERSONAL_ACCESS_TOKEN = "";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();

    // 1. Create formatted header row if sheet is empty
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
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // 2. Append candidate's test results to the Google Sheet
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

    // 3. Automatically commit assessment report into GitHub submissions/ folder
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

    const reportPayload = {
      candidate: data.student,
      dateSubmitted: new Date().toISOString(),
      duration: data.durationStr,
      overallScore: `${data.overallScore} / ${data.totalQuestions}`,
      percentageScore: `${data.percentScore}%`,
      performanceReadinessTier: data.performanceTier,
      sectionScores: data.sectionScores,
      userAnswers: data.userAnswers
    };

    const jsonString = JSON.stringify(reportPayload, null, 2);
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
        message: `Auto-archive assessment report for ${data.student.name}`,
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
