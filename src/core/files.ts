import fs = require('fs');

export class Files {
  static Exist(fullpath: string): boolean {
    try {
      return fs.statSync(fullpath).isFile();
    } catch (e) {
      return false;
    }
  }

  static Write(fullpath: string, body: string, encodage: string, callback?: (err: NodeJS.ErrnoException) => void): void {
    fs.writeFile(fullpath, body, encodage, callback);
  }

  static Delete(fullpath: string): void {
    fs.unlink(fullpath);
  }
}
