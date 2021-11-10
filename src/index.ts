import { join } from 'path';
import { promisify } from 'util';
import { execFile as _execFile } from 'child_process';
import { Binary } from '@binary/type';

const execFile = promisify(_execFile);

export const HOME = join(__dirname, '..', 'binary');

const INSTALL_DIR = join(HOME, `RI-2020.4-${process.platform}`);

export default <Binary>{
  homeDir: HOME,

  binaryDir: join(INSTALL_DIR, 'XtensaTools', 'bin'),

  env: {
    XTENSA_CORE: 'venus_hifi4',
    XTENSA_SYSTEM: join(INSTALL_DIR, 'venus_hifi4', 'config'),
  },

  async version() {
    const { stdout } = await execFile(join(this.binaryDir, 'xt-xcc'), ['--version'], { env: this.env });
    return stdout.split('\n')[0].trim();
  }
};
