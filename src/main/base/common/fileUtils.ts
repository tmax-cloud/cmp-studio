import fs from 'fs';
import path from 'path';

export function getExtentionName(resourcePath: string) {
  return path.posix.extname(resourcePath);
}

export function getDirName(resourcePath: string) {
  return path.dirname(resourcePath);
}

export function makeDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    // TODO: 이미 dir 존재할 땐 에러처리 어떻게 할 것인가
    throw new Error(`[Error] Directory already exists : ${dirPath}`);
  }
}

export function createFile(resourcePath: string) {
  const dirname = path.dirname(resourcePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  if (!fs.existsSync(resourcePath)) {
    fs.writeFileSync(resourcePath, Buffer.from(''));
  }
}

export function writeFileString(resourcePath: string, data: string) {
  if (fs.existsSync(resourcePath)) {
    fs.writeFileSync(resourcePath, Buffer.from(data));
  }
}

export function writeFileJson(resourcePath: string, data: any) {
  if (fs.existsSync(resourcePath)) {
    writeFileString(resourcePath, JSON.stringify(data));
  }
}

export function readFileString(resourcePath: string) {
  if (fs.existsSync(resourcePath)) {
    return fs.readFileSync(resourcePath, { encoding: 'utf-8' });
  }
  return `[Error] There is no such file : ${resourcePath}`;
}

export function readFileJson(resourcePath: string) {
  if (fs.existsSync(resourcePath)) {
    const fileStr = fs.readFileSync(resourcePath, { encoding: 'utf-8' });
    return !fileStr ? JSON.parse(fileStr) : {};
  }
  return `[Error] There is no such file : ${resourcePath}`;
}
