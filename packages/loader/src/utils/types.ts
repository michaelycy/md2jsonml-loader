import { TransformOptions } from '@babel/core';
import { IMarkdownData } from '../types';

export interface IBabelConfig
  extends Partial<Pick<TransformOptions, 'plugins' | 'presets' | 'filename'>> {}

export interface IDemoCodeTempFile {
  src: string;
  temp: string;
}

export interface IDataAppendOptions {
  clsPrefix?: string;
  babelConfig?: IBabelConfig;
  resolveExtensions?: string[];
}

export interface IAppendsDemo {
  title: any[];
  content: any[];
  code?: string;
  highlight?: any[];
  attributes: { src: string; [key: string]: string };
  dependencies?: IDependencyFile[];
  sandboxCode?: string;
}

export interface IMarkdownDataAppendDemo extends IMarkdownData {
  demos: IAppendsDemo[];
  demosToc: any;
}

export interface IDependencyPackage {
  type: 'package';
  name: string;
  version: string;
}
export interface IDependencyLocal {
  type: 'local';
  source: string;
  path: string;
  vmPath: string;
  import: string;
}

export type IDependencyFile = IDependencyPackage | IDependencyLocal;

export interface IToc {
  id: string;
  tag: string;
  text: string;
  node: any;
}
