# Currently WIP 🚧
# Simple JS CLI spinner
A tiny library-less 61 line spinner to be used in your npm projects to make running multiple commands much easier. No dependencies, no install, simply copy and paste the `Spinner.ts` file to use. Example usage can be seen in the `index.ts`

## Code
_Note: This may have changed, check `Spinner.ts` for the most up-to-date version_

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

      if (code === 1 || stderr.includes("ERROR") || stderr.includes("Error")) {
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

### Example usage
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
[Screencast from 11-12-2025 12:32:57 AM.webm](https://github.com/user-attachments/assets/016334cf-680f-4410-8017-0aaadc7eb181)


## Why library-less?
A lot of projects and orgs will have rules about what libraries can be used in prjects. It's no surprise, given how many issues there have been with npm packages over the years, for example the [left pad incident](https://en.wikipedia.org/wiki/Npm_left-pad_incident), or the [faker.js incident](https://www.revenera.com/blog/software-composition-analysis/the-story-behind-colors-js-and-faker-js/), and there are more examples of this. Most of the time libraries are completely fine, however they also become another package to keep up to date, another package to fix transitive dependency issues for, another package which can push a breaking update without giving you a heads up. Libraries are fantastic, but sometimes you only need a few lines to achieve exactly what you want. By copy-pasting the code into your project, you're the owner and you can change it as you see fit.

## Recipes
### Colour
The codes here are ASCII colour codes, here's a [helpful table](https://www.shellhacks.com/bash-colors/) you can use to see all of the colours available

TODO

#### Rainbow

TODO

### Spinner
You can easily grab one from the fantastic [cli-spinners](https://github.com/sindresorhus/cli-spinners) project. All the available spinners can be seen on the [jsfiddle](https://jsfiddle.net/sindresorhus/2eLtsbey/) provided in their README. Once you see one you like you can just copy the frames from the [spinners.json](https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json). Huge thank you to them, the animations are fantastic! 😄

_Note: Remember that the speed of the animation is determined by the number of frames, if you keep the interval constant, but have less frames then it will appear faster and with more frames it will appear slower_

TODO
