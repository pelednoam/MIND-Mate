MIND-Mate
---

## 1. Project Vision

A "Decision Support & Supplement System" that acts as a proactive coach. It focuses on weekly scoring rather than daily calorie counting, offering real-time advice and "Repair" strategies when the user deviates from the brain-health targets.

---

## 2. Core Constraints & Personalization

The developer must hard-code these filters into the logic engine to ensure the LLM never provides invalid advice:

* **Medical Sensitivities:** Strict **No Beans** (Legumes) and **No Lactose** (Dairy).
* **Daily Anchors:** * **Breakfast:** Toast or Lactose-free yogurt.
* **Dinner:** Salad with an Omelet.


* **Lifestyle:** Office-based lunch (multiple choice), high-control snacks.
* **Scoring Adjustment:** The "Bean" point category (usually 3/week) must be redistributed to **Nuts** and **Fish** to ensure nutritional balance.

---

## 3. System Architecture: The Hybrid Engine

The app should use a **Hybrid Logic/LLM Architecture**:

1. **The Logic Layer (State):** A database (Supabase/Firebase) tracking the current week’s score () for 14 categories (9 healthy, 5 limit).
2. **The Context Layer:** A JSON object containing the user’s sensitivities, the day's routine, and the "Weekly Gap" (what points are missing).
3. **The LLM Layer (Intelligence):** An API (OpenAI GPT-4o or Gemini 1.5 Pro) that receives the state + user input to generate conversational coaching.

---

## 4. Key Features & Functionality

### A. The Setup Screen (Onboarding)

* **Routine Builder:** Set default ingredients for Breakfast and Dinner (e.g., "Whole-grain toast", "Spinach-based salad").
* **Coach Personality:** A text-based "System Prompt" field. Default: *“Concise, proactive, empathetic coach. Use warning/repair logic for limit foods. Never suggest beans/lactose.”*
* **Sensitivity Toggles:** Global filters for Lactose and Beans.

### B. The "Smart Coach" Chat (Primary UI)

* **Option Duel:** User inputs 2–3 lunch options; the coach returns the "MIND Winner."
* **Warning & Repair Logic:** * **IF** user selects a "Limit" food (e.g., Red Meat, Fried Food):
* **THEN** Coach issues a warning.
* **IF** user proceeds:
* **THEN** Coach updates the database and immediately suggests a "Repair" for the next meal (e.g., "Add extra leafy greens tonight to offset the saturated fat").



### C. Proactive Nudge System

A scheduled background worker (Cron) that sends push notifications:

* **Morning (08:00):** Suggests a specific "Booster" for the breakfast routine based on missing points (e.g., "Add walnuts today").
* **Pre-Lunch (11:45):** General reminder of what to look for at the office.
* **Afternoon (15:00):** Suggests a snack (Nuts/Berries) if those weekly targets are low.
* **Evening (18:00):** Dinner optimization based on the day’s lunch choice.

---

## 5. Weekly Progress Dashboard

A visual representation of the scoring system:

* **Primary Metrics:** 10 Progress Rings for healthy groups (Leafy Greens, Berries, etc.).
* **The "Budget" Bar:** 5 Horizontal bars for "Limit" foods (Red meat, Fried food, etc.).
* **Espresso Tracker:** A simple daily counter for the 2-shot habit.
* **Weekly "Brain High Score":** A calculated percentage based on .

---

## 6. Logic Table for Developer (MIND Ruleset)

| Category | Target | User Specifics |
| --- | --- | --- |
| **Leafy Greens** | 6+ / week | Anchor to Dinner Salad. |
| **Other Veggies** | 1+ / day | Focus on Office Lunch sides. |
| **Berries** | 2+ / week | Supplement to Breakfast/Snack. |
| **Whole Grains** | 3+ / day | Focus on Toast/Office Grains. |
| **Fish** | 1+ / week | High priority office lunch. |
| **Nuts** | 6+ / week | **Elevated** to compensate for No Beans. |
| **Beans** | **REMOVED** | Ignore in logic. |
| **Red Meat** | < 4 / week | Trigger "Warning & Repair" if exceeded. |
| **Fried Food** | < 1 / week | Trigger "Warning & Repair" always. |

---

## 7. Technical Stack Recommendation

* **Frontend:** React (Next.js) or Flutter for a cross-platform web/mobile feel.
* **Database/Auth:** Supabase (excellent for real-time state and simple DB).
* **LLM Integration:** Vercel AI SDK (simplifies the connection between UI and LLM).
* **Notifications:** Firebase Cloud Messaging (FCM).

---

## 8. Sample Interaction Flow

> **User:** "Office lunch is Pizza or Grilled Chicken Wrap."
> **App (Logic Engine):** Detects Pizza has Cheese (Lactose) and Fried Crust (Limit).
> **Coach Response:** "The Grilled Chicken Wrap is the smarter play—it helps your Poultry goal and avoids the lactose in the pizza cheese. If you *really* want the pizza, we'll need to skip the omelet yolk tonight and go heavy on the spinach. Which one are you going with?"

**Would you like me to draft the specific JSON data structure for the "Meal Logging" part of the database?**