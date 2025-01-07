import {Converter} from 'showdown';

export const converter = new Converter({
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  smoothLivePreview: true,
  literalMidWordUnderscores: true, // avoid conflicting with latex
});
