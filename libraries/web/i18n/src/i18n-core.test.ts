import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {I18nCore} from './i18n-core.js';
import {I18nEventType} from './types.js';

enum TestStringKey {
  WELCOME = 'WELCOME',
  GREETING = 'GREETING',
  MESSAGE = 'MESSAGE',
  MULTI_PLACEHOLDER = 'MULTI_PLACEHOLDER',
}

type TestStrings = Record<TestStringKey, string>;

describe('I18nCore', () => {
  let originalNavigatorLanguage: string;
  let mockNavigatorLanguage: string;

  beforeEach(() => {
    // Save original navigator.language
    originalNavigatorLanguage = navigator.language;

    // Mock navigator.language
    mockNavigatorLanguage = 'en';
    Object.defineProperty(navigator, 'language', {
      get: () => mockNavigatorLanguage,
      configurable: true,
    });

    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {
      // Intentionally empty
    });
  });

  afterEach(() => {
    // Restore original navigator.language
    Object.defineProperty(navigator, 'language', {
      get: () => originalNavigatorLanguage,
      configurable: true,
    });

    // Restore console methods
    vi.restoreAllMocks();
  });

  const createMockStrings = (lang: string): TestStrings => ({
    [TestStringKey.WELCOME]: lang === 'en' ? 'Welcome!' : '欢迎！',
    [TestStringKey.GREETING]: lang === 'en' ? 'Hello, {}!' : '你好，{}！',
    [TestStringKey.MESSAGE]:
      lang === 'en' ? '{} says hello to {}!' : '{}向{}问好！',
    [TestStringKey.MULTI_PLACEHOLDER]:
      lang === 'en' ? 'A {} B {} C' : 'A {} B {} C',
  });

  const createMockLoaders = () => ({
    en: vi.fn(async () => Promise.resolve(createMockStrings('en'))),
    'zh-cn': vi.fn(async () => Promise.resolve(createMockStrings('zh-cn'))),
  });

  describe('Constructor', () => {
    it('should initialize with navigator language', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Wait for initial load from constructor
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Constructor calls ensureStringsLoaded once
      expect(loaders.en).toHaveBeenCalledTimes(1);
    });

    it('should store config values correctly', async () => {
      const loaders = createMockLoaders();
      const placeholderMark = '{}';
      const defaultLanguageCode = 'en';

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode,
        placeholderMark,
      });

      await core.ensureStringsLoaded();

      // Verify by using the stored values
      const result = core.getString(TestStringKey.GREETING, 'Test');
      expect(result).toBe('Hello, Test!');
    });

    it('should call ensureStringsLoaded on construction', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Wait a tick for async constructor code
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(loaders.en).toHaveBeenCalled();
    });

    it('should register window languagechange listener', async () => {
      const loaders = createMockLoaders();
      const listenerCallback = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listenerCallback);

      // Change language and trigger event
      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      // Wait for async handler
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(loaders['zh-cn']).toHaveBeenCalled();
      expect(listenerCallback).toHaveBeenCalled();
    });
  });

  describe('ensureStringsLoaded()', () => {
    it('should load strings for current language', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(loaders.en).toHaveBeenCalled();
      expect(core.getString(TestStringKey.WELCOME)).toBe('Welcome!');
    });

    it('should use cached strings if language has not changed', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Wait for constructor load
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Call twice more
      await core.ensureStringsLoaded();
      await core.ensureStringsLoaded();

      // Loader should only be called once (from constructor)
      expect(loaders.en).toHaveBeenCalledTimes(1);
    });

    it('should reload strings when language changes', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      expect(core.getString(TestStringKey.WELCOME)).toBe('Welcome!');

      // Change language
      mockNavigatorLanguage = 'zh-cn';
      await core.ensureStringsLoaded();

      expect(loaders['zh-cn']).toHaveBeenCalled();
      expect(core.getString(TestStringKey.WELCOME)).toBe('欢迎！');
    });

    it('should fallback to default language when current language not available', async () => {
      mockNavigatorLanguage = 'fr'; // Not in loaders
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(loaders.en).toHaveBeenCalled();
      expect(core.getString(TestStringKey.WELCOME)).toBe('Welcome!');
    });

    it('should throw error when neither current nor default language is available', async () => {
      mockNavigatorLanguage = 'fr';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'de', // Not in loaders
        placeholderMark: '{}',
      });

      await expect(core.ensureStringsLoaded()).rejects.toThrow(
        'No language loader found for fr or default language de',
      );
    });

    it('should update currentLanguageCode after loading', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      // Change language
      mockNavigatorLanguage = 'zh-cn';
      await core.ensureStringsLoaded();

      // Verify by checking that cache works (no reload when calling again)
      loaders['zh-cn'].mockClear();
      await core.ensureStringsLoaded();
      expect(loaders['zh-cn']).not.toHaveBeenCalled();
    });
  });

  describe('getString()', () => {
    it('should return translated string for valid key', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(core.getString(TestStringKey.WELCOME)).toBe('Welcome!');
    });

    it('should return empty string for non-existent key', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(core.getString('NON_EXISTENT' as TestStringKey)).toBe('');
    });

    it('should return empty string when strings not loaded', () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Call immediately without awaiting load
      expect(core.getString(TestStringKey.WELCOME)).toBe('');
    });

    it('should warn when called before strings loaded', () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      core.getString(TestStringKey.WELCOME);

      expect(console.warn).toHaveBeenCalledWith('I18n is not ready yet');
    });

    it('should format string with single placeholder', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(core.getString(TestStringKey.GREETING, 'Alice')).toBe(
        'Hello, Alice!',
      );
    });

    it('should format string with multiple placeholders', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(core.getString(TestStringKey.MESSAGE, 'Alice', 'Bob')).toBe(
        'Alice says hello to Bob!',
      );
    });

    it('should format string with custom placeholder mark', async () => {
      mockNavigatorLanguage = 'en';
      const customLoaders = {
        en: async () =>
          Promise.resolve({
            [TestStringKey.GREETING]: 'Hello, {{}}!',
          } as TestStrings),
      };

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: customLoaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{{}}',
      });

      await core.ensureStringsLoaded();

      expect(core.getString(TestStringKey.GREETING, 'Alice')).toBe(
        'Hello, Alice!',
      );
    });

    it('should throw error when too few arguments provided for placeholders', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      // MESSAGE expects 2 placeholders, but only 1 is provided
      expect(() => {
        core.getString(TestStringKey.MESSAGE, 'Alice');
      }).toThrow('The numbers of placeholders and args do not match');
    });

    it('should throw error when too many arguments provided for placeholders', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      // GREETING expects 1 placeholder, but 2 are provided
      expect(() => {
        core.getString(TestStringKey.GREETING, 'Alice', 'Bob');
      }).toThrow('The numbers of placeholders and args do not match');
    });

    it('should throw error when arguments provided but string has no placeholders', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      // WELCOME has no placeholders, but 1 argument is provided
      expect(() => {
        core.getString(TestStringKey.WELCOME, 'Alice');
      }).toThrow('The numbers of placeholders and args do not match');
    });

    it('should handle placeholder mark within argument values', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      // Value contains the placeholder mark itself
      expect(core.getString(TestStringKey.GREETING, 'Alice{}Bob')).toBe(
        'Hello, Alice{}Bob!',
      );
    });

    it('should handle empty string as argument value', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(core.getString(TestStringKey.GREETING, '')).toBe('Hello, !');
    });
  });

  describe('addEventListener()', () => {
    it('should add listener for LANGUAGE_CHANGE event', async () => {
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener);

      // Trigger language change
      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(listener).toHaveBeenCalled();
    });

    it('should support multiple listeners for same event', async () => {
      const loaders = createMockLoaders();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener1);
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener2);

      // Trigger language change
      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should create new Set if no listeners exist for event type', () => {
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Should not throw
      expect(() => {
        core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener);
      }).not.toThrow();
    });
  });

  describe('removeEventListener()', () => {
    it('should remove specific listener', async () => {
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener);
      core.removeEventListener(I18nEventType.LANGUAGE_CHANGE, listener);

      // Trigger language change
      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(listener).not.toHaveBeenCalled();
    });

    it('should do nothing if listener does not exist', () => {
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Should not throw
      expect(() => {
        core.removeEventListener(I18nEventType.LANGUAGE_CHANGE, listener);
      }).not.toThrow();
    });

    it('should do nothing if no listeners exist for event type', () => {
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Should not throw
      expect(() => {
        core.removeEventListener(I18nEventType.LANGUAGE_CHANGE, listener);
      }).not.toThrow();
    });
  });

  describe('Event Dispatching', () => {
    it('should dispatch LANGUAGE_CHANGE event when language changes', async () => {
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener);

      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should call all registered listeners when dispatching', async () => {
      const loaders = createMockLoaders();
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener1);
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener2);
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener3);

      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
    });

    it('should pass correct payload to listeners', async () => {
      const loaders = createMockLoaders();
      let capturedPayload: TestStrings | null = null;
      const listener = vi.fn((payload: TestStrings) => {
        capturedPayload = payload;
      });

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener);

      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(capturedPayload).not.toBeNull();
      expect(capturedPayload?.[TestStringKey.WELCOME]).toBe('欢迎！');
    });

    it('should not throw if no listeners registered', async () => {
      const loaders = createMockLoaders();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      // Should not throw
      expect(async () => {
        mockNavigatorLanguage = 'zh-cn';
        window.dispatchEvent(new Event('languagechange'));
        await new Promise((resolve) => setTimeout(resolve, 10));
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete language switch flow', async () => {
      mockNavigatorLanguage = 'en';
      const loaders = createMockLoaders();
      const listener = vi.fn();

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();
      expect(core.getString(TestStringKey.WELCOME)).toBe('Welcome!');

      core.addEventListener(I18nEventType.LANGUAGE_CHANGE, listener);

      // Change language
      mockNavigatorLanguage = 'zh-cn';
      window.dispatchEvent(new Event('languagechange'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(listener).toHaveBeenCalled();
      expect(core.getString(TestStringKey.WELCOME)).toBe('欢迎！');
    });

    it('should handle async loader correctly', async () => {
      const delayedLoader = vi.fn(
        async () =>
          new Promise<TestStrings>((resolve) => {
            setTimeout(() => {
              resolve(createMockStrings('en'));
            }, 50);
          }),
      );

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: {en: delayedLoader},
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await core.ensureStringsLoaded();

      expect(delayedLoader).toHaveBeenCalled();
      expect(core.getString(TestStringKey.WELCOME)).toBe('Welcome!');
    });

    it('should handle loader errors gracefully', async () => {
      const errorLoader = vi.fn(() => Promise.reject(new Error('Load failed')));

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: {en: errorLoader},
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      await expect(core.ensureStringsLoaded()).rejects.toThrow('Load failed');
    });

    it('should handle concurrent calls to ensureStringsLoaded without duplicate loading', async () => {
      mockNavigatorLanguage = 'en';
      const delayedLoader = vi.fn(
        async () =>
          new Promise<TestStrings>((resolve) => {
            setTimeout(() => {
              resolve(createMockStrings('en'));
            }, 50);
          }),
      );

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: {en: delayedLoader},
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Wait for constructor's initial load to complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      delayedLoader.mockClear();

      // Call ensureStringsLoaded multiple times concurrently
      const promise1 = core.ensureStringsLoaded();
      const promise2 = core.ensureStringsLoaded();
      const promise3 = core.ensureStringsLoaded();

      await Promise.all([promise1, promise2, promise3]);

      // Loader should only be called once despite 3 concurrent calls
      // (Already loaded from constructor, so should use cache)
      expect(delayedLoader).toHaveBeenCalledTimes(0);
    });

    it('should handle concurrent calls when language changes', async () => {
      mockNavigatorLanguage = 'en';
      let loadCount = 0;
      const delayedLoader = vi.fn(
        async () =>
          new Promise<TestStrings>((resolve) => {
            setTimeout(() => {
              loadCount++;
              resolve(createMockStrings('en'));
            }, 50);
          }),
      );

      const loaders = {
        en: delayedLoader,
        'zh-cn': vi.fn(
          async () =>
            new Promise<TestStrings>((resolve) => {
              setTimeout(() => {
                loadCount++;
                resolve(createMockStrings('zh-cn'));
              }, 50);
            }),
        ),
      };

      const core = new I18nCore<TestStringKey, TestStrings>({
        languageLoaders: loaders,
        defaultLanguageCode: 'en',
        placeholderMark: '{}',
      });

      // Wait for initial load
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(loadCount).toBe(1);

      // Reset mock call count for zh-cn loader
      loaders['zh-cn'].mockClear();

      // Change language and call concurrently (without triggering window event)
      mockNavigatorLanguage = 'zh-cn';
      const promise1 = core.ensureStringsLoaded();
      const promise2 = core.ensureStringsLoaded();
      const promise3 = core.ensureStringsLoaded();

      await Promise.all([promise1, promise2, promise3]);

      // Should only load once for the new language despite concurrent calls
      expect(loaders['zh-cn']).toHaveBeenCalledTimes(1);
      expect(core.getString(TestStringKey.WELCOME)).toBe('欢迎！');
    });
  });
});
