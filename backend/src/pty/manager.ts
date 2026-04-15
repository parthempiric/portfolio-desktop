import * as pty from "node-pty";
import { config } from "../config.js";

export function spawnPty(cols: number = 80, rows: number = 24): pty.IPty {
  const env: Record<string, string> = {
    TERM: "xterm-256color",
    COLORTERM: "truecolor",
    LANG: "en_US.UTF-8",
    PATH: "/usr/local/bin:/usr/bin:/bin",
    // HOME: `/home/${config.ptyUser}`,
    // USER: config.ptyUser,
    SHELL: config.ptyShell,
  };

  const shell = "su";
  const args = [config.ptyUser];

  const ptyProcess = pty.spawn("bash", [], {
    name: "xterm-256color",
    cols,
    rows,
    env,
    uid: undefined, // Set if running as root to switch to guest user
    gid: undefined,
  });

  // ptyProcess.onData((data) => {
  //   if (data.includes('Password:')) {
  //     ptyProcess.write(`${config.ptyUser}\r`);
  //   }
  // });

  return ptyProcess;
}
