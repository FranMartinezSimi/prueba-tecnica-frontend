// Mock para import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:3000/",
    },
  },
} as unknown;

// Mock para matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
