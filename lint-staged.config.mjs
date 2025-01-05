/**
 * By default, we use global executables for all apps and packages.
 * If any app/package needs to use their own executables,
 * create lint-staged.config.mjs under its own folder,
 * and import configs from this file if needed.
 *
 * See https://github.com/lint-staged/lint-staged?tab=readme-ov-file#how-to-use-lint-staged-in-a-multi-package-monorepo.
 * */
export const prettierConfig = Object.freeze({
  '*': ['prettier --write --ignore-unknown'],
});

export const eslintConfig = Object.freeze({
  './**/src/**/*.?(m)(j|t)(s|sx)': [
    // We use a flag here to ensure eslint uses correct config files.
    // The flag should be stable in eslint v10,
    // see https://eslint.org/docs/v9.x/use/configure/configuration-files#experimental-configuration-file-resolution
    'eslint --flag unstable_config_lookup_from_file --fix',
  ],
});

export default {
  ...prettierConfig,
  ...eslintConfig,
};
