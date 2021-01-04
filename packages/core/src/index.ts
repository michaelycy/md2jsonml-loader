import MT, { MTResult } from 'mark-twain';

export type IMTResult = MTResult;

export function transform(source: string) {
  return MT(source);
}
