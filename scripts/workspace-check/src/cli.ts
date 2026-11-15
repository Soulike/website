import {fileURLToPath} from 'node:url';

import {checkWorkspaces} from './check-workspaces.ts';

const PROJECT_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const {checkedCount, issues} = checkWorkspaces(PROJECT_ROOT);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(
      `Workspace package "${issue.packageName}" (${issue.workspacePath}) is missing: ${issue.missing.join(', ')}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(
    `Workspace scripts verified for ${checkedCount.toString()} packages.`,
  );
}
