import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'; // use this to use the above scypt in an async call

const scryptAsync = promisify(scrypt);

class PasswordManager {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // explictly make this a typed object (Buffer) again

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

export default PasswordManager;
