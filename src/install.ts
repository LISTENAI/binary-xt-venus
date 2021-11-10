import download, { DownloadOptions } from '@xingrz/download2';
import { rm, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { execFile as _execFile } from 'child_process';
import { HOME } from './index';

const execFile = promisify(_execFile);

const URL_BASE = 'https://cdn.iflyos.cn/public/lisa-binary/xt-venus';

const URL_TOOLS = `${URL_BASE}/XtensaTools_RI_2020_4_${process.platform}.tar.zst`;
const URL_CORE = `${URL_BASE}/venus_hifi4_${process.platform}.tar.zst`;

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

  const installDir = join(HOME, `RI-2020.4-${process.platform}`);
  const toolsDir = join(installDir, 'XtensaTools');
  const coreDir = join(installDir, 'venus_hifi4');

  const paramsFile = join(coreDir, 'config', 'venus_hifi4-params');

  let params = await readFile(paramsFile, 'utf-8');
  if (process.platform == 'linux') {
    params = params.replaceAll('/././home/xpgcust/tree/RI-2020.4/ib/tools/swtools-x86_64-linux', toolsDir);
    params = params.replaceAll('/././project/cust/genapp/RI-2020.4/build/chipskytek/prod/venus_hifi4/333958/RI-2020.4/venus_hifi4', coreDir);
    params = params.replaceAll('/././usr/xtensa/tools-8.0', join(toolsDir, 'Tools'));
  } else if (process.platform == 'win32') {
    params = params.replaceAll('C:/././build/tree/RI-2020.4_kuma/ib/tools/swtools-MSWin32-x86', toolsDir);
    params = params.replaceAll('C:/././build/build/RI-2020.4/chipskytek/prod/venus_hifi4/333959/RI-2020.4-win32/venus_hifi4', coreDir);
    params = params.replaceAll('C:/././usr/xtensa/tools-8.0', join(toolsDir, 'Tools'));
  }
  await writeFile(paramsFile, params);

})();
