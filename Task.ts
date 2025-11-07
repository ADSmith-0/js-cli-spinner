import { exec } from "node:child_process";
import { clearLine, cursorTo } from "node:readline";

const BOLD_BLUE = "\x1b[1;34m";
const BOLD_GREEN = "\x1b[1;32m";
const BOLD_RED = "\x1b[1;31m";
const RESET = "\x1b[0m";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

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
  }, 80);

  return new Promise<{ stdout: string }>((resolve) => {
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

      if (code === 0) {
        process.stdout.write(`\r${BOLD_GREEN}✔️ ${RESET}${finishedText}\n`);
      } else {
        process.stdout.write(`\r${BOLD_RED}✖️ ${RESET}${taskName}\n`);
        process.stderr.write(stderr);
        process.exit(1);
      }

      resolve({ stdout });
    });
  });
};
