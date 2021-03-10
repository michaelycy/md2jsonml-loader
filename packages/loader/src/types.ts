import { IBabelConfig } from './utils/types';

export interface ILoaderOptions {
  clsPrefix?: string;
  tocMaxDepth?: 1 | 2 | 3 | 4 | 5 | 6;
  tocKeepElem?: boolean;
  demoBabelConfig?: Omit<IBabelConfig, 'filename'>;
  demoResolveExtensions?: string[];
  demoIgnoreDependencies?: (string | { name: string; version: string })[];
  demoPresetDependencies?: Record<string, string>;
}

export interface IMarkdownData {
  content: any[];
  filepath: string;
  fileAbsolutePath: string;
}
