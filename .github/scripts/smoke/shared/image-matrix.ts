export interface ImageMatrixEntry {
  'docker-build-target': string;
  'docker-file-path': string;
  'smoke-script': string;
}

const targets = [
  {
    filter: 'blog',
    'docker-build-target': 'blog',
    'docker-file-path': './apps/web/blog-vite/Dockerfile',
    'smoke-script': '.github/scripts/smoke/blog-web.ts',
  },
  {
    filter: 'admin',
    'docker-build-target': 'admin',
    'docker-file-path': './apps/web/admin-vite/Dockerfile',
    'smoke-script': '.github/scripts/smoke/admin-web.ts',
  },
  {
    filter: 'game-2048',
    'docker-build-target': 'game-2048',
    'docker-file-path': './apps/web/game-2048/Dockerfile',
    'smoke-script': '.github/scripts/smoke/game-2048-web.ts',
  },
  {
    filter: 'auth-server',
    'docker-build-target': 'auth-server',
    'docker-file-path': './apps/server/auth/Dockerfile',
    'smoke-script': '.github/scripts/smoke/auth-server.ts',
  },
  {
    filter: 'admin-server-legacy',
    'docker-build-target': 'admin-server-legacy',
    'docker-file-path': './apps/server/admin-legacy/Dockerfile',
    'smoke-script': '.github/scripts/smoke/admin-server.ts',
  },
  {
    filter: 'blog-server-legacy',
    'docker-build-target': 'blog-server-legacy',
    'docker-file-path': './apps/server/blog-legacy/Dockerfile',
    'smoke-script': '.github/scripts/smoke/blog-server.ts',
  },
  {
    filter: 'database-server-legacy',
    'docker-build-target': 'database-server-legacy',
    'docker-file-path': './apps/server/database-legacy/Dockerfile',
    'smoke-script': '.github/scripts/smoke/database-server.ts',
  },
] as const;

export function buildImageMatrix(
  filters: Readonly<Record<string, string | undefined>>,
): ImageMatrixEntry[] {
  const selectedTargets =
    filters.shared === 'true'
      ? targets
      : targets.filter(({filter}) => filters[filter] === 'true');

  return selectedTargets.map(({filter: _filter, ...target}) => target);
}
