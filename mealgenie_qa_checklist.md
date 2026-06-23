# Meal Genie-Pro SaaS QA Testing Checklist

**Tester Name:** ____________________
**Date of Testing:** __________________
**Environment:** [ ] Local Development [ ] Staging [ ] Production

## Instructions for the QA Tester
Please go through each of the following sections and verify the functionality. For each item, mark **Pass (P)**, **Fail (F)**, or **Not Applicable (N/A)**. If an item fails, please provide a detailed note explaining the issue, including steps to reproduce.

---

## 1. Authentication & Onboarding
- [ ] **Sign Up:** User can successfully create a new account.
- [ ] **Log In:** Existing user can log in with valid credentials.
- [ ] **Password Reset:** "Forgot Password" flow correctly sends an email and allows password change.
- [ ] **Sign Out:** Clicking "Sign Out" from the sidebar successfully logs the user out and redirects to the homepage.

---

## 2. Core Dashboard ("Start Cooking" / "Mix Drinks")
**Test both "Food" and "Drink" modes by switching the active mode.**

### Food Mode ("Start Cooking" & "Pantry" Integration)
- [ ] **UI Rendering:** The "Start Cooking" menu is visible and active.
- [ ] **Add to Pantry:** Navigate to "My Pantry", manually add **at least three** different ingredients, and verify they appear in the list.
- [ ] **Remove from Pantry:** Delete **only one** item from "My Pantry" and verify it is removed while the others remain.
- [ ] **Sync to Start Cooking:** Return to the "Start Cooking" menu and verify that the remaining items in "My Pantry" successfully persisted after leaving the page and appear as available ingredients.
- [ ] **Use Pantry Items:** Select those remaining synced Pantry items to use for a meal.
- [ ] **Generate Recipe:** Click generate and ensure a realistic, properly formatted recipe is created using those ingredients.
- [ ] **Usage Limits (Free Tier):** If testing a free account, the recipe generation counter correctly decrements. Upon reaching 0, the generation is blocked and prompts for upgrade.

### Drink Mode ("Mix Drinks" & "Bar" Integration)
- [ ] **Mode Toggle:** User can successfully switch to Drink Mode.
- [ ] **UI Rendering:** The menu updates to "Mix Drinks" and "My Bar" instead of "Start Cooking" and "My Pantry".
- [ ] **Add to Bar:** Navigate to "My Bar", manually add **at least three** liquors/mixers, and verify they appear.
- [ ] **Remove from Bar:** Delete **only one** item from "My Bar" and verify it is removed while the others remain.
- [ ] **Sync to Mix Drinks:** Return to the "Mix Drinks" menu and verify that the remaining items in "My Bar" successfully persisted after leaving the page and appear as available ingredients.
- [ ] **Use Bar Items:** Select those remaining synced Bar items to mix a drink.
- [ ] **Generate Cocktail:** System generates a valid cocktail recipe based on those specific inputs.
- [ ] **Usage Limits (Free Tier):** Cocktail generations properly decrement the free drink counter.

---

## 3. Discover (`/dashboard/discover`)
- [ ] **Page Load:** Discover page loads successfully with featured recipes/drinks.
- [ ] **Search/Filter:** Users can search for specific recipes or filter by category.
- [ ] **Recipe Details:** Clicking a discovered recipe opens the full details and instructions.

---

## 4. Pantry & Bar Management (Direct Management)
- [ ] **Direct Check:** Verify the UI elements within `/dashboard/pantry` load without errors.
- [ ] **Persistence:** Refresh the page to ensure Pantry/Bar items are saved to the database and remain visible.

---

## 5. Meal Planner (`/dashboard/planner`)
*(Food Mode Only)*
- [ ] **Calendar View:** The weekly/monthly planner renders correctly.
- [ ] **Add to Plan:** User can assign a recipe to a specific day and meal type (Breakfast, Lunch, Dinner).
- [ ] **Remove from Plan:** User can delete a planned meal.

---

## 6. My Goals (`/dashboard/goals`)
*(Food Mode Only)*
- [ ] **Set Goals:** User can input dietary restrictions, macro goals, or calorie limits.
- [ ] **Save Goals:** Goal settings successfully save and persist on refresh.

---

## 7. Cookbook / Cocktail Book (`/dashboard/cookbook`)
- [ ] **Save Recipe:** User can save a generated or discovered recipe to their Cookbook.
- [ ] **Categorization:** Food recipes save to the "Cookbook"; Drink recipes save to the "Cocktail Book".
- [ ] **View Saved:** User can retrieve and view the full details of saved recipes.
- [ ] **Delete Saved:** User can remove recipes from their book.

---

## 8. Holistic Hub (`/holistic-research`)
- [ ] **Navigation:** Clicking "Holistic Hub" loads the research platform.
- [ ] **Content Rendering:** Articles, brand-aligned logos, and CTAs (e.g., YouTube subscription) display correctly.

---

## 9. Settings & Account (`/dashboard/settings`)
- [ ] **Profile Data:** User email and profile settings display correctly.
- [ ] **Premium Status Display:** If the user is "Pro" or "Founders Club", the correct badge displays in the top navigation bar.
- [ ] **Upgrade Flow:** Free users can initiate the upgrade process (check link/modal functionality).

---

## 10. External Integrations
- [ ] **YouTube Link:** The "Watch on YouTube" link in the sidebar correctly opens `https://www.youtube.com/@MealGenie-Pro` in a new tab.

---

## Failure Notes & Bug Reports
*Please document any Fails here with steps to reproduce.*

1. **[Menu/Feature Name]:** [Description of the issue]
2. ...
