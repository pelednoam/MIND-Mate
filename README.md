# 🧠 MIND-Mate: Your Proactive Brain-Health Coach

**MIND-Mate** is a specialized web application designed to help users follow the **MIND Diet** (Mediterranean-DASH Intervention for Neurodegenerative Delay). Unlike standard calorie trackers, MIND-Mate acts as a proactive decision-support system, focusing on weekly nutritional goals and brain-healthy habits.

---

## ✨ Core Philosophy
MIND-Mate is built for real-life decision making. It acknowledges that you don't always have 100% control over your meals (like at the office), but you can always **optimize** and **repair**.

- **Proactive, not Passive:** The app nudges you at key decision points.
- **Decision Support:** Helps you choose the "MIND-winner" from office lunch options.
- **Warning & Repair:** Alerts you to "limit" foods and immediately suggests a recovery plan for the next meal.
- **Personalized Logic:** Hard-coded to handle specific dietary sensitivities (**Lactose & Beans**).

---

## 🚀 Key Features

### 1. The Smart Coach (LLM-Powered)
A conversational interface that provides real-time dietary advice based on your current state.
* **Option Duel:** Compare multiple meal options to find the best brain-health choice.
* **Smart Suggestions:** Recommendations based on your current weekly "gaps."
* **Contextual Memory:** Knows your routines and what you've already eaten today.

### 2. Personalized "Anchors"
* **Morning Routine:** Quick-log for your standard breakfast (Toast/Lactose-free yogurt).
* **Evening Routine:** Quick-log for your dinner salad and omelet.
* **Smart Snacks:** Suggests nuts or berries to fill weekly quotas during office hours.

### 3. Weekly Progress Dashboard
* **Visual Rings:** Track 10 healthy food groups (Leafy greens, Berries, Fish, etc.).
* **Limit Budgets:** Keep an eye on "Limit" foods (Red meat, Fried food, etc.).
* **The "Brain High Score":** A weekly percentage goal based on the official MIND scoring system.

---

## 🥗 The MIND-Mate Logic (Custom Ruleset)

| Category | Target | Note |
| :--- | :--- | :--- |
| **Leafy Greens** | 6+ / week | Primary focus for Dinner Salad. |
| **Nuts** | 6+ / week | **Elevated** to replace bean-based fiber. |
| **Berries** | 2+ / week | Focus on Breakfast/Snack supplement. |
| **Fish** | 1+ / week | High priority selection for Office Lunch. |
| **Beans** | **0** | **STRICT FILTER:** User is sensitive. Ignore in scoring. |
| **Lactose** | **0** | **STRICT FILTER:** Use non-lactose alternatives. |
| **Red Meat** | < 4 / week | Trigger "Warning & Repair" if exceeded. |
| **Fried Food** | < 1 / week | Trigger "Warning & Repair" always. |

---

## 🛠 Tech Stack
* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **AI Engine:** [OpenAI GPT-4o](https://openai.com/) (via Vercel AI SDK)
* **Environment:** WSL2 on Windows + Cursor AI.

---

## 📦 Getting Started

### Prerequisites
* **Node.js** (v18 or later)
* **WSL2** (Ubuntu recommended)
* **Git**

### Installation
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/MIND-Mate.git](https://github.com/YOUR_USERNAME/MIND-Mate.git)
   cd MIND-Mate