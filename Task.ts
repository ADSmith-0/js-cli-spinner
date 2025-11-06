import { clearLine, cursorTo } from "node:readline";

const BOLD_BLUE = "\x1b[1;34m";
const BOLD_GREEN = "\x1b[1;32m";
const RESET = "\x1b[0m";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let i = 0;

class Task {
  #interval: NodeJS.Timeout | undefined;

  constructor(taskName: string) {
    this.#interval = setInterval(() => {
      process.stdout.write(
        `\r${BOLD_BLUE}${FRAMES[i++ % FRAMES.length]}${RESET} ${taskName}...`,
      );
    }, 80);
  }

  done(taskName: string) {
    clearInterval(this.#interval);
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    process.stdout.write(`\r${BOLD_GREEN}✔ ${taskName}${RESET}\n`);
  }
}

export default Task;
