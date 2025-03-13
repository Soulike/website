import {LanguageCode} from './language-code.js';
import {STRING_KEY} from './string-key.js';
import {Strings} from './strings/Strings.js';

export enum I18nEventType {
  LANGUAGE_CHANGE = 'languagechange',
}

type I18nEventListener<T> = (payload: T) => void;

interface EventTypeToPayload {
  [I18nEventType.LANGUAGE_CHANGE]: Strings;
}

// TODO: add test
class I18nCore {
  private eventTypeToListeners: Map<
    I18nEventType,
    Set<I18nEventListener<unknown>>
  >;
  private currentLanguageCode: string;
  private strings: Strings | null;

  constructor() {
    this.eventTypeToListeners = new Map();
    this.currentLanguageCode = navigator.language.toLowerCase();
    this.strings = null;

    this.loadStringsForCurrentLanguageCode().catch((error: unknown) => {
      console.error(error);
    });

    window.addEventListener('languagechange', () => {
      this.loadStringsForCurrentLanguageCode().catch((error: unknown) => {
        console.error(error);
      });
    });
  }

  public async ensureI18nLoaded() {
    await this.loadStringsForCurrentLanguageCode();
  }

  public getString(key: STRING_KEY): string {
    if (!this.strings) {
      console.warn('I18n is not ready yet');
    }
    return this.strings?.[key] ?? '';
  }

  public addEventListener(
    type: I18nEventType,
    callback: I18nEventListener<EventTypeToPayload[typeof type]>,
  ): void {
    let listeners = this.eventTypeToListeners.get(type);
    if (!listeners) {
      listeners = new Set();
    }
    listeners.add(callback as I18nEventListener<unknown>);
    this.eventTypeToListeners.set(type, listeners);
  }

  public removeEventListener(
    type: I18nEventType,
    callback: I18nEventListener<EventTypeToPayload[typeof type]>,
  ): void {
    const listeners = this.eventTypeToListeners.get(type);
    if (!listeners) {
      return;
    }
    listeners.delete(callback as I18nEventListener<unknown>);
    this.eventTypeToListeners.set(type, listeners);
  }

  private dispatchEvent(
    type: I18nEventType,
    payload: EventTypeToPayload[typeof type],
  ): void {
    const listeners = this.eventTypeToListeners.get(type);
    if (!listeners) {
      return;
    }
    for (const listener of listeners) {
      listener(payload);
    }
  }

  private async loadStringsForCurrentLanguageCode() {
    const languageCode = navigator.language.toLowerCase();
    if (languageCode == this.currentLanguageCode && this.strings) {
      return;
    }

    if (languageCode === LanguageCode.ZH_CN) {
      const {ZH_CN} = await import('./strings/zh-cn.js');
      this.strings = ZH_CN;
    } else {
      const {EN} = await import('./strings/en.js');
      this.strings = EN;
    }
    this.currentLanguageCode = languageCode;
    this.dispatchEvent(I18nEventType.LANGUAGE_CHANGE, this.strings);
  }
}

export const i18nCore = new I18nCore();
