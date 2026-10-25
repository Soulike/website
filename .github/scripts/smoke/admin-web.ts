import {requiredImageArgument} from './shared/harness.ts';
import {smokeWebImage} from './shared/web-image.ts';

await smokeWebImage(requiredImageArgument(), ['admin-server']);
