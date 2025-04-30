# Shared Views

The folder contains views shared by CSR and SSR.

## Note

If the view contains any components created via styled-components, remember to add `'use client'` to ensure it compiles
with SSR.

To use styled-components with Next.js, use `StyledComponentsRegistry` in `next-js` folder in root layout.
See https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components.
