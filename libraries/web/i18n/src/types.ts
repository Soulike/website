export interface I18nConfig<
  StringKey extends PropertyKey,
  KeyToString extends Record<StringKey, string>,
> {
  languageLoaders: Record<string, (() => Promise<KeyToString>) | undefined>;
  defaultLanguageCode: string;
  placeholderMark: string;
}

export enum I18nEventType {
  LANGUAGE_CHANGE = 'languagechange',
}

export type I18nEventListener<T> = (payload: T) => void;

export interface EventTypeToPayload<KeyToString> {
  [I18nEventType.LANGUAGE_CHANGE]: KeyToString;
}
