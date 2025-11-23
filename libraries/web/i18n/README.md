# @website/i18n

A generic, type-safe internationalization (i18n) library for React applications.

## Basic Usage

### 1. Create i18n Instance

```typescript
import {createI18n} from '@website/i18n';

// Define your string keys
enum STRING_KEY {
  WELCOME = 'WELCOME',
  HELLO_USER = 'HELLO_USER',
}

// Define your strings type
type Strings = Readonly<Record<STRING_KEY, string>>;

// Define language codes (ISO language codes from navigator.language.toLowerCase())
const LanguageCode = {
  EN: 'en',
  ZH_CN: 'zh-cn',
} as const;

const PLACEHOLDER_MARK = '{}';

// Create i18n instance
export const {getI18nString, useI18nString} = createI18n<STRING_KEY, Strings>({
  languageLoaders: {
    [LanguageCode.EN]: async () => (await import('./strings/en.js')).EN,
    [LanguageCode.ZH_CN]: async () =>
      (await import('./strings/zh-cn.js')).ZH_CN,
  },
  defaultLanguageCode: LanguageCode.EN,
  placeholderMark: PLACEHOLDER_MARK,
});
```

### 2. Use in React Components

```typescript
import {useI18nString} from './i18n-instance.js';
import {STRING_KEY} from './string-key.js';

function MyComponent() {
  const welcomeText = useI18nString(STRING_KEY.WELCOME);
  const helloText = useI18nString(STRING_KEY.HELLO_USER, 'Alice');

  return <h1>{welcomeText}</h1>;
}
```

### 3. Use Outside React

```typescript
import {getI18nString} from './i18n-instance.js';
import {STRING_KEY} from './string-key.js';

const message = await getI18nString(STRING_KEY.WELCOME);
```
