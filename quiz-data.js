// Quiz Data for Student Discovery & Readiness Assessment
const QUIZ_CONFIG = {
  title: "Student Discovery & Readiness Assessment",
  organization: "EdMissions",
  tagline: "Imagine. Build. Become.",
  description: "Hi there! Welcome to EdMissions! This assessment is an opportunity for us to get to know you better—your interests, strengths, and aspirations. It covers three areas: General Aptitude, English Readiness, and Math Readiness. Take your time, read each question carefully, and answer to the best of your ability. Good luck!",
  passingScorePercent: 60,
  timeLimitMinutes: 45,
  webhookUrl: ""
};

const QUIZ_SECTIONS = [
  { id: "aptitude", name: "General Aptitude", icon: "🧠", total: 10 },
  { id: "english", name: "English Readiness", icon: "📖", total: 10 },
  { id: "math", name: "Math Readiness", icon: "📐", total: 10 }
];

const QUESTIONS = [
  // SECTION 1: GENERAL APTITUDE
  {
    id: 1,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "BOOK : READ :: MUSIC : ?",
    options: ["Listen", "Write", "Draw", "Count"],
    correctIndex: 0,
    explanation: "A book is something you read; music is something you listen to. The analogy is object : primary mode of consumption."
  },
  {
    id: 2,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "Find the next number in the sequence: 5, 11, 23, 47, ___",
    options: ["71", "83", "94", "95"],
    correctIndex: 3,
    explanation: "Each number is multiplied by 2 and then 1 is added: 5×2+1 = 11, 11×2+1 = 23, 23×2+1 = 47, 47×2+1 = 95. Alternatively, the differences double each time: +6, +12, +24, +48 (47 + 48 = 95)."
  },
  {
    id: 3,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "A cellphone is on sale for $960 after a 20% discount. What was its original price?",
    options: ["$1,120", "$1,180", "$1,200", "$1,250"],
    correctIndex: 2,
    explanation: "After a 20% discount, the sale price is 80% (0.80) of the original price. Original Price = $960 / 0.80 = $1,200."
  },
  {
    id: 4,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "Three workers can complete a task in 8 days at the same rate. How many days would four workers take to complete the same task?",
    options: ["10 days", "6 days", "4 days", "5 days"],
    correctIndex: 1,
    explanation: "Total work = 3 workers × 8 days = 24 worker-days. With 4 workers, time required = 24 / 4 = 6 days."
  },
  {
    id: 5,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "All researchers are curious. Some students are researchers. Which statement must be true?",
    options: [
      "No researchers are students.",
      "Some students are curious.",
      "All students are curious.",
      "Some students are not curious."
    ],
    correctIndex: 1,
    explanation: "Because some students are researchers, and every researcher is curious, those students who are researchers must be curious. Therefore, 'Some students are curious' must be true."
  },
  {
    id: 6,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "Find the next number in the sequence: 2, 5, 11, 23, 47, ___",
    options: ["83", "94", "71", "95"],
    correctIndex: 3,
    explanation: "The differences between consecutive terms are 3, 6, 12, 24 (doubling each time). The next difference is 48. Thus, 47 + 48 = 95."
  },
  {
    id: 7,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "7. Study the sequence and choose the option that continues the rotation.",
    image: "images/q7.png",
    options: [
      "A",
      "B",
      "C",
      "D"
    ],
    svgDiagram: `
      <div class="visual-diagram-box">
        <div class="diagram-title">Sequence (Clockwise 90° Rotation):</div>
        <div class="diagram-steps">
          <div class="diag-step"><div class="diag-box"><span class="arrow">↑</span></div><span>Step 1</span></div>
          <div class="diag-step"><div class="diag-box"><span class="arrow">→</span></div><span>Step 2</span></div>
          <div class="diag-step"><div class="diag-box"><span class="arrow">↓</span></div><span>Step 3</span></div>
          <div class="diag-step"><div class="diag-box next-target"><span class="arrow">?</span></div><span>Step 4</span></div>
        </div>
      </div>
    `,
    correctIndex: 0,
    explanation: "The shape rotates 90 degrees clockwise at each step. Option A correctly completes the sequence."
  },
  {
    id: 8,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "8. Identify the rule across the rows and columns, then choose the missing cell.",
    image: "images/q8.png",
    options: ["A", "B", "C", "D"],
    svgDiagram: `
      <div class="visual-diagram-box">
        <div class="diagram-title">Pattern Matrix:</div>
        <div class="matrix-grid">
          <div class="m-cell">⚪ Circle</div><div class="m-cell">🔺 Triangle</div><div class="m-cell">⬛ Square</div>
          <div class="m-cell">🔺 Triangle</div><div class="m-cell">⬛ Square</div><div class="m-cell">⚪ Circle</div>
          <div class="m-cell">⬛ Square</div><div class="m-cell">⚪ Circle</div><div class="m-cell highlight-cell">❓ [ ? ]</div>
        </div>
      </div>
    `,
    correctIndex: 0,
    explanation: "Analyzing row by row and column by column reveals the cyclic distribution rule. Option A completes the pattern."
  },
  {
    id: 9,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "A student records the number of pages read over four days: Monday 18, Tuesday 24, Wednesday 21, and Thursday 27. What was the percentage increase from Monday to Thursday?",
    options: ["33⅓%", "66⅔%", "25%", "50%"],
    correctIndex: 3,
    explanation: "Increase = Thursday (27) − Monday (18) = 9 pages. Percentage Increase = (9 / 18) × 100% = 50%."
  },
  {
    id: 10,
    section: "aptitude",
    sectionName: "General Aptitude",
    text: "A project begins at 9:40 a.m. Task 1 takes 35 minutes, followed by a 10-minute break. Task 2 takes 20 minutes, followed by another 10-minute break. Task 3 takes 45 minutes. At what time does the project finish?",
    options: ["11:50 a.m.", "11:20 a.m.", "11:40 a.m.", "11:30 a.m."],
    correctIndex: 2,
    explanation: "Total elapsed time = 35 + 10 + 20 + 10 + 45 = 120 minutes (2 hours). 9:40 a.m. + 2 hours = 11:40 a.m."
  },

  // SECTION 2: ENGLISH READINESS
  {
    id: 11,
    section: "english",
    sectionName: "English Readiness",
    text: "For decades, urban planners treated trees primarily as decorative features of public spaces. More recent research, however, has shown that tree canopies can lower surface temperatures, absorb stormwater, and reduce some forms of air pollution. These benefits have led several cities to include tree coverage in their climate-resilience plans.\n\nWhich choice best states the main idea of the text?",
    options: [
      "City planners have always considered trees essential infrastructure.",
      "Research has encouraged cities to recognize trees as contributors to urban resilience.",
      "Trees are effective only when planted in areas with heavy rainfall.",
      "Most cities have replaced decorative parks with climate-resilience projects."
    ],
    correctIndex: 1,
    explanation: "The passage explains how new research showing environmental benefits (temperature reduction, stormwater absorption) prompted cities to treat trees as functional contributors to climate resilience rather than just decorations."
  },
  {
    id: 12,
    section: "english",
    sectionName: "English Readiness",
    text: "The scientist's conclusion was tentative: although the initial results supported her hypothesis, she emphasized that a larger sample was needed before the finding could be accepted.\n\nAs used in the text, “tentative” most nearly means:",
    options: ["Uncertain", "Unnecessary", "Widely celebrated", "Deliberately misleading"],
    correctIndex: 0,
    explanation: "In this context, 'tentative' means provisional, hesitant, or not yet confirmed/definite, which is best captured by 'Uncertain'."
  },
  {
    id: 13,
    section: "english",
    sectionName: "English Readiness",
    text: "In a study, two groups of seedlings received the same amount of water and sunlight. One group was grown in soil enriched with compost; the other was grown in untreated soil. After six weeks, the compost group had a greater average height. The researchers cautioned that the experiment had not yet been repeated with other plant species.\n\nWhich inference is best supported by the text?",
    options: [
      "Compost will increase the height of every plant species.",
      "Sunlight has no effect on seedling growth.",
      "Compost may have contributed to greater growth in the seedlings studied.",
      "Untreated soil prevents seedlings from growing."
    ],
    correctIndex: 2,
    explanation: "The seedlings with compost grew taller on average under identical water and sunlight conditions, so compost likely contributed to their growth. The author's caution about other species prevents broader generalizations."
  },
  {
    id: 14,
    section: "english",
    sectionName: "English Readiness",
    text: "Historian Lena Ortiz argues that early railway stations were more than transportation hubs: their waiting rooms, ticket counters, and public clocks helped establish new expectations about punctuality. She supports this claim by comparing railway schedules with the less standardized travel routines that preceded them.\n\nWhat is the main purpose of the text?",
    options: [
      "To argue that railways were less reliable than earlier forms of travel.",
      "To describe how railway stations influenced social habits and timekeeping.",
      "To explain why public clocks were removed from railway stations.",
      "To compare the construction costs of different transportation systems."
    ],
    correctIndex: 1,
    explanation: "The passage describes Ortiz's thesis that railway stations shaped cultural expectations regarding punctuality and standardized time."
  },
  {
    id: 15,
    section: "english",
    sectionName: "English Readiness",
    text: "The collection of handwritten letters, along with two diaries, _____ in the university archive.",
    options: ["Are kept", "Have been kept", "Is kept", "Were kept"],
    correctIndex: 2,
    explanation: "The grammatical subject is 'The collection' (singular). The intervening prepositional phrase 'along with two diaries' does not change the number of the subject. Therefore, the singular verb 'Is kept' is required."
  },
  {
    id: 16,
    section: "english",
    sectionName: "English Readiness",
    text: "The first trial of the water filter removed most visible particles. _____, laboratory tests showed that some dissolved contaminants remained in the water.",
    options: ["For example", "Nevertheless", "Similarly", "Consequently"],
    correctIndex: 1,
    explanation: "'Nevertheless' signals contrast between the success in removing visible particles and the remaining dissolved contaminants."
  },
  {
    id: 17,
    section: "english",
    sectionName: "English Readiness",
    text: "The researcher had one immediate priority _____ to verify that the sensor was recording accurate data.",
    options: [",", ";", ":", "and"],
    correctIndex: 2,
    explanation: "A colon (:) is properly used after an independent clause to introduce an explanation, clarification, or specification of what that priority was."
  },
  {
    id: 18,
    section: "english",
    sectionName: "English Readiness",
    text: "Because the two studies used different definitions of “economic growth,” their findings are not directly comparable. A new analysis would need to apply the same measure to both data sets.\n\nAs used in the text, “comparable” most nearly means:",
    options: [
      "Capable of being meaningfully compared.",
      "Equally expensive to conduct.",
      "Published at the same time.",
      "Likely to produce identical results."
    ],
    correctIndex: 0,
    explanation: "'Comparable' means capable of being judged against one another on a common scale or standard."
  },
  {
    id: 19,
    section: "english",
    sectionName: "English Readiness",
    text: "A museum introduced free admission on the first Sunday of each month. In the following six months, attendance on those Sundays rose by 40 percent, while attendance on other Sundays remained nearly unchanged. The museum director concluded that free admission was associated with increased attendance on the designated days.\n\nWhich finding would most directly support the director's conclusion?",
    options: [
      "Visitors generally spend more time in museums during winter.",
      "The museum's gift shop sells more postcards on Saturdays.",
      "A nearby museum also offers free admission once a month.",
      "Surveys show that many visitors who came on free Sundays said the no-cost entry influenced their decision."
    ],
    correctIndex: 3,
    explanation: "Direct survey confirmation that visitors specifically chose to attend because of free admission directly verifies the causal link behind the attendance spike."
  },
  {
    id: 20,
    section: "english",
    sectionName: "English Readiness",
    text: "A student has taken the following notes:\n• The Arctic tern migrates between the Arctic and the Antarctic.\n• Its annual round trip can exceed 70,000 kilometers.\n• The bird experiences daylight during much of both polar summers.\n• Researchers track its route using small electronic devices.\n\nThe student wants to emphasize the extraordinary distance traveled by the Arctic tern. Which choice best uses the notes to achieve this goal?",
    options: [
      "Researchers use small electronic devices to track the Arctic tern's route.",
      "The Arctic tern migrates between two polar regions, where daylight patterns vary by season.",
      "With an annual round trip that can exceed 70,000 kilometers, the Arctic tern travels an extraordinary distance between the Arctic and Antarctic.",
      "The Arctic tern experiences daylight during much of both polar summers."
    ],
    correctIndex: 2,
    explanation: "This option directly highlights the specific metric (70,000 km) and frames it explicitly around the extraordinary distance traveled."
  },

  // SECTION 3: MATH READINESS
  {
    id: 21,
    section: "math",
    sectionName: "Math Readiness",
    text: "A music service charges a one-time setup fee of $12 plus $7 for each month of service. Which equation gives the total cost C, in dollars, after m months?",
    options: ["C = 12m + 7", "C = 7m + 12", "C = 19m", "C = 7(m + 12)"],
    correctIndex: 1,
    explanation: "The recurring monthly rate is $7 per month ($7m) and the fixed initial fee is $12. Thus, total cost C = 7m + 12."
  },
  {
    id: 22,
    section: "math",
    sectionName: "Math Readiness",
    text: "A circle has a radius of 6 centimeters. What is its area, in square centimeters?",
    options: ["6π", "12π", "36π", "72π"],
    correctIndex: 2,
    explanation: "Area of a circle = πr². With r = 6 cm, Area = π(6²) = 36π cm²."
  },
  {
    id: 23,
    section: "math",
    sectionName: "Math Readiness",
    text: "Which ordered pair is a solution to the inequality y > 2x − 3?",
    options: ["(1, −2)", "(2, 2)", "(0, −4)", "(−1, −6)"],
    correctIndex: 1,
    explanation: "Testing (2, 2): y = 2 and 2(2) − 3 = 1. Since 2 > 1 is true, (2, 2) is a valid solution."
  },
  {
    id: 24,
    section: "math",
    sectionName: "Math Readiness",
    text: "At a school event, 2 adult tickets and 3 student tickets cost $31. Four adult tickets and 1 student ticket cost $37. What is the price of one student ticket?",
    options: ["$5", "$7", "$8", "$9"],
    correctIndex: 0,
    explanation: "Let A = adult price, S = student price. (1) 2A + 3S = 31, (2) 4A + S = 37. Multiplying (1) by 2 gives 4A + 6S = 62. Subtracting (2): 5S = 25 => S = $5 (and A = $8)."
  },
  {
    id: 25,
    section: "math",
    sectionName: "Math Readiness",
    text: "For x ≠ 3, which expression is equivalent to (x² − 9) / (x − 3)?",
    options: ["x − 3", "x + 3", "x² + 3", "(x − 3)(x + 3)"],
    correctIndex: 1,
    explanation: "Factoring the difference of squares in the numerator: (x² − 9) = (x − 3)(x + 3). Cancelling the common factor (x − 3) gives x + 3."
  },
  {
    id: 26,
    section: "math",
    sectionName: "Math Readiness",
    text: "The function f is defined by f(x) = (x − 4)² − 6. What is the minimum value of f(x)?",
    options: ["−6", "−4", "4", "6"],
    correctIndex: 0,
    explanation: "Since (x − 4)² ≥ 0 for all real numbers x, its minimum value is 0 (which occurs at x = 4). Therefore, the minimum value of f(x) is 0 − 6 = −6."
  },
  {
    id: 27,
    section: "math",
    sectionName: "Math Readiness",
    text: "A laboratory sample contains 500 bacteria. The number of bacteria decreases by 20% each hour. Which expression represents the number of bacteria remaining after t hours?",
    options: ["500(0.2)ᵗ", "500(0.8)ᵗ", "500 − 20t", "500(1.2)ᵗ"],
    correctIndex: 1,
    explanation: "If the population decreases by 20% each hour, 100% − 20% = 80% (or 0.8) remains each hour. The exponential decay expression is 500(0.8)ᵗ."
  },
  {
    id: 28,
    section: "math",
    sectionName: "Math Readiness",
    text: "How many distinct real solutions does the equation (x + 2)² = 7 have?",
    options: ["Zero", "Exactly One", "Exactly Two", "Infinitely many"],
    correctIndex: 2,
    explanation: "Taking square roots on both sides: x + 2 = ±√7, yielding x = −2 + √7 and x = −2 − √7. These are two distinct real solutions."
  },
  {
    id: 29,
    section: "math",
    sectionName: "Math Readiness",
    text: "Which expression is equivalent to 2/(x + 1) + 1/(x − 2), for x ≠ −1, 2?",
    options: [
      "3 / [(x + 1)(x − 2)]",
      "(3x − 3) / [(x + 1)(x − 2)]",
      "(3x + 1) / [(x + 1)(x − 2)]",
      "3 / (2x − 1)"
    ],
    correctIndex: 1,
    explanation: "Finding a common denominator: [2(x − 2) + 1(x + 1)] / [(x + 1)(x − 2)] = (2x − 4 + x + 1) / [(x + 1)(x − 2)] = (3x − 3) / [(x + 1)(x − 2)]."
  },
  {
    id: 30,
    section: "math",
    sectionName: "Math Readiness",
    text: "A store discounts a $80 jacket by 25%. A customer then uses a coupon for an additional 10% off the discounted price. What is the final price before tax?",
    options: ["$52", "$54", "$56", "$60"],
    correctIndex: 1,
    explanation: "After 25% discount: $80 × 0.75 = $60. After additional 10% discount: $60 × 0.90 = $54."
  }
];
