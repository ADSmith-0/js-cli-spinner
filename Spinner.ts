import { exec } from "node:child_process";
import { clearLine, cursorTo } from "node:readline";

type Stdout = string;

const BOLD_BLUE = "\x1b[1;34m";
const BOLD_GREEN = "\x1b[1;32m";
const BOLD_YELLOW = "\x1b[1;33m";
const BOLD_RED = "\x1b[1;31m";
const RESET = "\x1b[0m";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const INTERVAL = 80;

export const withSpinner = ({
  taskName,
  cmd,
  finishedText,
}: {
  taskName: string;
  cmd: string;
  finishedText: string;
}) => {
  let i = 0;
  const spinner = setInterval(() => {
    process.stdout.write(
      `\r${BOLD_BLUE}${FRAMES[i++ % FRAMES.length]}${RESET} ${taskName}...`,
    );
  }, INTERVAL);

  return new Promise<Stdout>((resolve) => {
    const task = exec(cmd);

    let stdout: string = "";
    let stderr: string = "";

    task.stdout?.on("data", (data) => {
      stdout += data;
    });

    task.stderr?.on("data", (data) => {
      stderr += data;
    });

    task.on("close", (code) => {
      clearInterval(spinner);
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);

      if (code === 1) {
        process.stdout.write(`\r${BOLD_RED}✖${RESET} ${taskName}\n`);
        process.stderr.write(stderr);
        process.exit(1);
      }
      process.stdout.write(`\r${BOLD_GREEN}✔${RESET} ${finishedText}\n`);
      if (code !== 0 && code !== null) {
        process.stdout.write(`\r${BOLD_YELLOW}⚠${RESET} Warning: Process exited with a non-zero code: ${code}\n`);
      }
      resolve(stdout);
    });
  });
};
