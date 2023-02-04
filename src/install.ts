import download, { DownloadOptions } from '@xingrz/download2';
import { rm } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { execFile as _execFile } from 'child_process';
import { HOME } from './index';

const execFile = promisify(_execFile);

const URL_BASE = 'https://cdn.iflyos.cn/public/lisa-binary/xt-venus';

const URL_TOOLS = `${URL_BASE}/XtensaTools_RI_2021_7_${process.platform}.tar.zst`;
const URL_CORE = `${URL_BASE}/venus_hifi4_${process.platform}-2021.7.tar.zst`;

(async () => {

  try {
    await rm(HOME, { recursive: true });
  } catch (e) {
  }

  const options: DownloadOptions = {
    extract: true,
    timeout: {
      connect: 60 * 1000,
    },
  }

  await download(URL_TOOLS, HOME, options);
  await download(URL_CORE, HOME, options);

  const installDir = join(HOME, `RI-2021.7-${process.platform}`);
  const toolsDir = join(installDir, 'XtensaTools');
  const coreDir = join(installDir, 'venus_hifi4');

  await execFile(join(coreDir, 'install'), ['--xtensa-tools', toolsDir, '--registry', join(toolsDir, 'config')]);
})();
