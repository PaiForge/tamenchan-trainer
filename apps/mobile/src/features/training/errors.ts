/**
 * サポートされていないパターンが指定された場合にスローされるエラー
 */
export class PatternNotSupportedError extends Error {
  /**
   *
   */
  constructor(patternId: string) {
    super(`Pattern ID "${patternId}" is not supported.`);
    this.name = "PatternNotSupportedError";
  }
}
