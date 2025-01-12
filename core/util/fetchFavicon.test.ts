// Generated by continue

import {
  findFaviconPath,
  getFaviconBase64,
  fetchFavicon,
} from "./fetchFavicon";

describe("findFaviconPath", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return the favicon URL when a favicon link is present", async () => {
    const mockHtml = `
      <html>
        <head>
          <link rel="icon" href="/favicon.ico">
        </head>
        <body></body>
      </html>
    `;
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(mockHtml),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const url = new URL("https://example.com");
    const faviconPath = await findFaviconPath(url);

    expect(faviconPath).toBe("https://example.com/favicon.ico");
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
  });

  it("should return undefined when no favicon link is present", async () => {
    const mockHtml = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(mockHtml),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const url = new URL("https://example.com");
    const faviconPath = await findFaviconPath(url);

    expect(faviconPath).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
  });

  it("should handle fetch errors gracefully and return undefined", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const url = new URL("https://example.com");
    const faviconPath = await findFaviconPath(url);

    expect(faviconPath).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
  });

  it("should handle non-OK responses and return undefined", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const url = new URL("https://example.com");
    const faviconPath = await findFaviconPath(url);

    expect(faviconPath).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
  });

  it("should handle relative favicon URLs", async () => {
    const mockHtml = `
      <html>
        <head>
          <link rel="icon" href="favicon.ico">
        </head>
        <body></body>
      </html>
    `;
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(mockHtml),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const url = new URL("https://example.com");
    const faviconPath = await findFaviconPath(url);

    expect(faviconPath).toBe("https://example.com/favicon.ico");
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
  });
});

describe("getFaviconBase64", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return base64 data URI of the favicon", async () => {
    const iconData = "icon data";
    const arrayBuffer = new TextEncoder().encode(iconData).buffer;
    const mockResponse = {
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      headers: {
        get: jest.fn().mockReturnValue("image/png"),
      },
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    global.btoa = jest
      .fn()
      .mockImplementation((str) =>
        Buffer.from(str, "binary").toString("base64"),
      );

    const faviconUrl = "https://example.com/favicon.ico";
    const base64DataUri = await getFaviconBase64(faviconUrl);

    const expectedBase64 = Buffer.from(iconData).toString("base64");

    expect(base64DataUri).toBe(`data:image/png;base64,${expectedBase64}`);
    expect(global.fetch).toHaveBeenCalledWith(faviconUrl);
  });

  it("should handle fetch errors gracefully and return undefined", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const faviconUrl = "https://example.com/favicon.ico";
    const base64DataUri = await getFaviconBase64(faviconUrl);

    expect(base64DataUri).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(faviconUrl);
  });

  it("should handle non-OK responses and return undefined", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const faviconUrl = "https://example.com/favicon.ico";
    const base64DataUri = await getFaviconBase64(faviconUrl);

    expect(base64DataUri).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(faviconUrl);
  });

  it("should use default mime type if content-type header is missing", async () => {
    const iconData = "icon data";
    const arrayBuffer = new TextEncoder().encode(iconData).buffer;
    const mockResponse = {
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    global.btoa = jest
      .fn()
      .mockImplementation((str) =>
        Buffer.from(str, "binary").toString("base64"),
      );

    const faviconUrl = "https://example.com/favicon.ico";
    const base64DataUri = await getFaviconBase64(faviconUrl);

    const expectedBase64 = Buffer.from(iconData).toString("base64");

    expect(base64DataUri).toBe(`data:image/x-icon;base64,${expectedBase64}`);
    expect(global.fetch).toHaveBeenCalledWith(faviconUrl);
  });
});

describe("fetchFavicon", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return base64 data URI of the favicon when favicon is found", async () => {
    const url = new URL("https://example.com");

    // Mock fetch for homepage
    const homepageHtml = `
      <html>
        <head>
          <link rel="icon" href="/favicon.ico">
        </head>
        <body></body>
      </html>
    `;
    const homepageResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(homepageHtml),
    };

    // Mock fetch for favicon
    const iconData = "icon data";
    const arrayBuffer = new TextEncoder().encode(iconData).buffer;
    const faviconResponse = {
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      headers: {
        get: jest.fn().mockReturnValue("image/png"),
      },
    };

    const fetchMock = jest.fn();
    fetchMock.mockResolvedValueOnce(homepageResponse); // First fetch call
    fetchMock.mockResolvedValueOnce(faviconResponse); // Second fetch call

    global.fetch = fetchMock;
    global.btoa = jest
      .fn()
      .mockImplementation((str) =>
        Buffer.from(str, "binary").toString("base64"),
      );

    const result = await fetchFavicon(url);

    const expectedBase64 = Buffer.from(iconData).toString("base64");

    expect(result).toBe(`data:image/png;base64,${expectedBase64}`);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/favicon.ico",
    );
  });

  it("should return undefined when favicon is not found", async () => {
    const url = new URL("https://example.com");

    // Mock fetch for homepage
    const homepageHtml = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;
    const homepageResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(homepageHtml),
    };

    const fetchMock = jest.fn();
    fetchMock.mockResolvedValueOnce(homepageResponse); // First fetch call

    global.fetch = fetchMock;

    const result = await fetchFavicon(url);

    expect(result).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("https://example.com");
  });
});
