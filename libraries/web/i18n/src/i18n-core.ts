import assert from 'node:assert';

import {format} from './helpers/string-helpers.js';
import type {
  EventTypeToPayload,
  I18nConfig,
  I18nEventListener,
} from './types.js';
import {I18nEventType} from './types.js';

/**
 * Core internationalization class that manages language loading, caching, and string retrieval.
 *
 * @template StringKey - The type of keys used to look up translations (e.g., `STRING_KEY` enum values like `STRING_KEY.WELCOME`)
 * @template KeyToString - The type representing the mapping from keys to translated strings (e.g., `Record<STRING_KEY, string>`)
 *
 * @example
 * ```typescript
 * enum STRING_KEY { WELCOME = 'WELCOME' }
 * type KeyToString = Record<STRING_KEY, string>;
 * const core = new I18nCore<STRING_KEY, KeyToString>({
 *   languageLoaders: { 'en': async () => ({ [STRING_KEY.WELCOME]: 'Welcome!' }) },
 *   defaultLanguageCode: 'en',
 *   placeholderMark: '{}'
 * });
 * ```
 */
type ListenerMap<KeyToString> = {
  [K in I18nEventType]: Set<
    I18nEventListener<EventTypeToPayload<KeyToString>[K]>
  >;
};

export class I18nCore<
  StringKey extends PropertyKey,
  KeyToString extends Record<StringKey, string>,
> {
  private eventTypeToListeners: ListenerMap<KeyToString>;
  private currentLanguageCode: string;
  private keyToString: KeyToString | null;
  private loadingPromise: Promise<void> | null;
  private loadingLanguageCode: string | null;
  private readonly languageLoaders: Record<
    string,
    (() => Promise<KeyToString>) | undefined
  >;
  private readonly defaultLanguageCode: string;
  private readonly placeholderMark: string;

  constructor(config: I18nConfig<StringKey, KeyToString>) {
    this.eventTypeToListeners = {
      [I18nEventType.LANGUAGE_CHANGE]: new Set(),
    };
    this.currentLanguageCode = navigator.language.toLowerCase();
    this.keyToString = null;
    this.loadingPromise = null;
    this.loadingLanguageCode = null;
    this.languageLoaders = config.languageLoaders;
    this.defaultLanguageCode = config.defaultLanguageCode;
    this.placeholderMark = config.placeholderMark;

    this.ensureStringsLoaded().catch((error: unknown) => {
      console.error(error);
    });

    window.addEventListener('languagechange', () => {
      this.ensureStringsLoaded()
        .then(() => {
          assert(this.keyToString);
          this.dispatchEvent(I18nEventType.LANGUAGE_CHANGE, this.keyToString);
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    });
  }

  /**
   * Ensures language strings are loaded for the current browser language.
   * Uses cached strings if language hasn't changed. Falls back to default language if current language is not available.
   */
  public async ensureStringsLoaded() {
    const languageCode = navigator.language.toLowerCase();

    // If language hasn't changed and strings are loaded, return immediately
    if (languageCode === this.currentLanguageCode && this.keyToString) {
      return;
    }

    // If already loading for this language, return the existing promise
    if (this.loadingPromise && languageCode === this.loadingLanguageCode) {
      return this.loadingPromise;
    }

    // Start new loading process
    this.loadingLanguageCode = languageCode;
    this.loadingPromise = (async () => {
      const loader =
        this.languageLoaders[languageCode] ??
        this.languageLoaders[this.defaultLanguageCode];

      if (!loader) {
        throw new Error(
          `No language loader found for ${languageCode} or default language ${this.defaultLanguageCode}`,
        );
      }

      this.keyToString = await loader();
      this.currentLanguageCode = languageCode;
    })();

    try {
      await this.loadingPromise;
    } finally {
      // Clear the loading promise when done (success or failure)
      this.loadingPromise = null;
      this.loadingLanguageCode = null;
    }
  }

  /**
   * Gets a translated string for the given key with optional template arguments.
   *
   * @param key - String key to retrieve
   * @param values - Values to replace placeholders in the template string
   * @returns Translated and formatted string, or empty string if key not found
   */
  public getString(key: StringKey, ...values: string[]): string {
    if (!this.keyToString) {
      console.warn('I18n is not ready yet');
    }
    const template = this.keyToString?.[key];
    if (template === undefined || template.length === 0) {
      return '';
    }
    return format(template, this.placeholderMark, ...values);
  }

  /**
   * Adds an event listener for i18n events (e.g., language changes).
   *
   * @param type - Event type to listen for
   * @param callback - Callback function to invoke when event occurs
   */
  public addEventListener<K extends I18nEventType>(
    type: K,
    callback: I18nEventListener<EventTypeToPayload<KeyToString>[K]>,
  ): void {
    this.eventTypeToListeners[type].add(callback);
  }

  /**
   * Removes an event listener for i18n events.
   *
   * @param type - Event type to stop listening for
   * @param callback - Callback function to remove
   */
  public removeEventListener<K extends I18nEventType>(
    type: K,
    callback: I18nEventListener<EventTypeToPayload<KeyToString>[K]>,
  ): void {
    this.eventTypeToListeners[type].delete(callback);
  }

  private dispatchEvent<K extends I18nEventType>(
    type: K,
    payload: EventTypeToPayload<KeyToString>[K],
  ): void {
    for (const listener of this.eventTypeToListeners[type]) {
      listener(payload);
    }
  }
}
