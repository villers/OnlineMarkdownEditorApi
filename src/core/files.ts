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

  static NameIsBad(name: string): boolean {
    return (!/^[0-9a-zA-Z\.\-_\s]+$/im.test(name));
  }

  static ReadJson(name: string): any {
    return JSON.parse(fs.readFileSync(name, 'utf8'));
  }
}
