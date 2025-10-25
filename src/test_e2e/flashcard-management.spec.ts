import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/LoginPage";
import { CreateFlashcardPage } from "./page-objects/CreateFlashcardPage";
import { MyCardsPage } from "./page-objects/MyCardsPage";
import { registerUser, loginUser, deleteFlashcard, signOut } from "./utils/api";
import { faker } from "@faker-js/faker";

test.describe("Flashcard Management", () => {
  const userEmail = process.env.E2E_USERNAME as string;
  const userPassword = process.env.E2E_PASSWORD as string;
  let userToken: string;

  test.beforeEach(async () => {
    await signOut();

    // await registerUser(userEmail, userPassword);
    // const loginData = await loginUser(userEmail, userPassword);
    // userToken = loginData.session.access_token;
  });

  test.afterEach(async () => {
    // Changed to afterEach for better isolation
    if (userToken) {
      await signOut();
    }
  });

  test("should allow a user to generate flashcards from text and be redirected to review page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createFlashcardPage = new CreateFlashcardPage(page);

    const textToGenerate = faker.lorem.words(1500);

    // 1. Log in
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    await expect(page).toHaveURL("/create");

    // 2. Generate Flashcards from text
    await createFlashcardPage.goto();
    await createFlashcardPage.createFlashcard(textToGenerate);

    // 3. Expect redirection to /review page after successful generation
    await expect(page).toHaveURL("/review");
  });
});
