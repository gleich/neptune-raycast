import * as fs from "fs";
import path from "path";
import * as toml from "toml";

export interface Config {
  books: Book[];
  classes: Class[];
}

export interface Book {
  author: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
}

export function readConfig(): Config {
  const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  if (homeDir === undefined) {
    throw new Error("Could not find home directory");
  }
  return toml.parse(fs.readFileSync(path.join(homeDir, ".config", "neptune", "options.toml"), "utf8"));
}
