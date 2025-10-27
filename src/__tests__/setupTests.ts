import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Define a global variable for import.meta.env for testing
// @ts-ignore
global.import = { meta: { env: { OPENAI_API_KEY: "test-key" } } };

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
