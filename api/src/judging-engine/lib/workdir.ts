import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { v4 } from "uuid";

/**
 * Creates a directory in /tmp(Linux) and returns the path
 * @returns {string} A string containing the created temporary directory
 */
export function createTempWorkdir(): string {
  let workDir = mkdtempSync(join(tmpdir(), v4()));

  return workDir;
}
