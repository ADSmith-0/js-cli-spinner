# Simple JS CLI spinner
A tiny library-less 61 line spinner to be used in your npm projects to make running multiple commands much easier. No dependencies, no install, simply copy and paste the `Spinner.ts` file to use. Example usage can be seen in the `index.ts`

## Code
_Note: This may have changed, check `Spinner.ts` for the most up-to-date version

```ts
import { exec } from "node:child_process";
import { clearLine, cursorTo } from "node:readline";

type Stdout = string;

const BOLD_BLUE = "\x1b[1;34m";
const BOLD_GREEN = "\x1b[1;32m";
const BOLD_YELLOW = "\x1b[1;33m";
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
```

## Example usage
```ts
import { withSpinner } from "./Spinner";

await withSpinner({
  taskName: "Clearing Cache",
  cmd: "sleep 5",
  finishedText: "Cache cleared",
});

await withSpinner({
  taskName: "Error process",
  cmd: 'sleep 2; echo "Process exited with an error!" >&2; exit 1;',
  finishedText: "Process errored!",
});
```

### Output
