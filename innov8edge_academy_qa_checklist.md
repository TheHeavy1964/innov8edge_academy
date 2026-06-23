# Innov8Edge Academy QA Testing Checklist

**Tester Name:** ____________________
**Date of Testing:** __________________
**Environment:** [ ] Local Development [ ] Staging [ ] Production

## Instructions for the QA Tester
Please go through each of the following sections and verify the functionality for the Academy platform. For each item, mark **Pass (P)**, **Fail (F)**, or **Not Applicable (N/A)**. If an item fails, please provide a detailed note explaining the issue, including steps to reproduce.

---

## 1. Learning Paths Navigation
- [ ] **Section Load:** Scroll or click the navigation menu to jump to the "Learning Paths" section on the main landing page.
- [ ] **Track Visibility:** Verify all 4 tracks (Beginner, Intermediate, Builder, Business) are visible and properly styled.
- [ ] **Select AI Foundations:** Click "Start this path" on the **Beginner / AI Foundations** track and ensure it routes you correctly to the learning module.

---

## 2. AI Foundations (Beginner Track) Validation
Verify that each of the following 9 courses loads correctly. For each course, ensure the video player renders, the intro text is readable, the "Callout Box" displays with its specific styling, and the bulleted points are listed.

- [ ] **Lesson 1: What is AI? (15 min)**
  - Verify video loads (`https://www.youtube.com/watch?v=aircAruvnKk`)
  - Verify heading: *"The Three Types of AI You'll Actually Use"*
- [ ] **Lesson 2: What is an LLM? (20 min)**
  - Verify video loads
  - Verify heading: *"What Makes One LLM Different From Another"*
- [ ] **Lesson 3: Prompt Engineering Basics (30 min)**
  - Verify video loads
  - Verify heading: *"The Four Elements of a High-Performance Prompt"*
- [ ] **Lesson 4: AI Memory & Context (25 min)**
  - Verify video loads
  - Verify heading: *"The Four Memory Strategies in Modern AI Systems"*
- [ ] **Lesson 5: AI Ethics & Bias (20 min)**
  - Verify video loads
  - Verify heading: *"The Four Sources of AI Bias to Watch"*
- [ ] **Lesson 6: Security & Privacy (20 min)**
  - Verify video loads
  - Verify heading: *"Four Security Principles for AI Systems"*
- [ ] **Lesson 7: Identifying AI Opportunities (25 min)**
  - Verify video loads
  - Verify heading: *"Four Signals That a Task Is Ready for AI"*
- [ ] **Lesson 8: The AI Decision Matrix (30 min)**
  - Verify video loads
  - Verify heading: *"The Four Quadrants of the AI Decision Matrix"*
- [ ] **Lesson 9: Building the Business Case (35 min)**
  - Verify video loads
  - Verify heading: *"Four Components of a Compelling AI Business Case"*

---

## 3. General Lesson UI/UX
- [ ] **Duration UI:** Verify the duration badge (e.g., "15 min") appears correctly on all 9 lessons.
- [ ] **Callout Boxes:** Verify the special callout boxes (e.g., *"Mental Model: AI vs. Automation"*) render properly with distinct background styling so they pop out from the normal text.
- [ ] **Navigation Between Lessons:** Ensure the user can smoothly transition from one lesson to the next without the page breaking.

---

## Failure Notes & Bug Reports
*Please document any Fails here with steps to reproduce.*

1. **[Menu/Feature Name]:** [Description of the issue]
2. ...
