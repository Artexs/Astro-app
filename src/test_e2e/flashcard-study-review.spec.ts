import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/LoginPage";
import { StudyPage } from "./page-objects/StudyPage";
import { ReviewPage } from "./page-objects/ReviewPage";
import { registerUser, loginUser, createFlashcard, deleteFlashcard, signOut } from "./utils/api";
import { faker } from "@faker-js/faker";

test.describe("Flashcard Study and Review Flows", () => {
  const userEmail = process.env.E2E_USERNAME;
  const userPassword = process.env.E2E_PASSWORD;
  const userToken = process.env.E2E_USERNAME_ID;
  // let userToken: string;
  let flashcardId1: number;
  let flashcardId2: number;

  test.beforeAll(async () => {
    // Register and log in a user via API
    // await registerUser(userEmail, userPassword);
    const loginData = await loginUser(userEmail, userPassword);
    userToken = loginData.session.access_token;

    // Create some flashcards for study/review
    const flashcard1 = await createFlashcard(userToken, faker.lorem.sentence(), faker.lorem.paragraph());
    flashcardId1 = flashcard1.data.id;
    const flashcard2 = await createFlashcard(userToken, faker.lorem.sentence(), faker.lorem.paragraph());
    flashcardId2 = flashcard2.data.id;
  });

  test.afterAll(async () => {
    // Clean up: delete created flashcards and sign out
    if (userToken) {
      if (flashcardId1) await deleteFlashcard(userToken, flashcardId1);
      if (flashcardId2) await deleteFlashcard(userToken, flashcardId2);
      await signOut();
    }
  });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await expect(page).toHaveURL("/");
  });

  test.skip("should allow a user to complete a study session", async ({ page }) => {
    const studyPage = new StudyPage(page);
    await studyPage.goto();

    // Assuming there are at least two cards to study
    await expect(studyPage.cardFront).toBeVisible();
    await studyPage.flipCard();
    await expect(studyPage.cardBack).toBeVisible();
    await studyPage.markKnown();

    await expect(studyPage.cardFront).toBeVisible(); // Next card
    await studyPage.flipCard();
    await studyPage.markUnknown();

    await expect(studyPage.completionMessage).toBeVisible();
    await expect(studyPage.completionMessage).toContainText("Study session complete!");
  });

  test.skip("should allow a user to complete a review session", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.goto();

    // Assuming there are cards due for review
    await expect(reviewPage.cardFront).toBeVisible();
    await reviewPage.flipCard();
    await expect(reviewPage.cardBack).toBeVisible();
    await reviewPage.markEasy();

    await expect(reviewPage.cardFront).toBeVisible(); // Next card
    await reviewPage.flipCard();
    await reviewPage.markMedium();

    await expect(reviewPage.completionMessage).toBeVisible();
    await expect(reviewPage.completionMessage).toContainText("Review session complete!");
  });
});
