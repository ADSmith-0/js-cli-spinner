# Currently WIP 🚧
# Simple JS CLI spinner
A tiny library-less 61 line spinner to be used in your npm projects to make running multiple commands much easier. No dependencies, no install, simply copy and paste the `Spinner.ts` file to use. Example usage can be seen in the `index.ts`

## Installation
Copy the `Spinner.ts` file into your project, or you can copy and paste from below

_Below may have changed, check `Spinner.ts` for the most up-to-date version_

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
[Output.webm](https://github.com/user-attachments/assets/6f35af3b-f638-44f6-8984-a1b75e389b0b)


## Why library-less?
A lot of projects and orgs will have rules about what libraries can be used in projects. Sometimes all you need is a small file and that can cover every use-case you want. By copy-pasting the code into your project, you're the owner and you can change it as you see fit. See the recipes below to modify it

## Recipes
### Colour
The codes here are ASCII colour codes, here's a [helpful table](https://www.shellhacks.com/bash-colors/) you can use to see all of the colours available

For example, changing the spinner to purple:
```ts
const BOLD_PURPLE = "\x1b[1;35m";
...
`\r${BOLD_PURPLE}${FRAMES[i++ % FRAMES.length]}${RESET} ${taskName}...`,
```

[Colour.webm](https://github.com/user-attachments/assets/090c4a3c-349c-45a8-adf0-06f320326ac4)

### Rainbow

```ts
const FRAME_COLOURS = [BOLD_RED, BOLD_YELLOW, BOLD_GREEN, BOLD_BLUE, BOLD_PURPLE];
...
`\r${FRAME_COLOURS[Math.floor(i / FRAMES.length) % FRAME_COLOURS.length]}${FRAMES[i++ % FRAMES.length]}${RESET} ${taskName}...`,
```
  
[Rainbow.webm](https://github.com/user-attachments/assets/abfd3be5-26a5-4d36-8e7a-5e237ff71ede)

### Colourful text
The ASCII colours apply to everything before the `RESET`, so if you move it further down you can get colourful text as well

### Spinner
You can easily grab one from the fantastic [cli-spinners](https://github.com/sindresorhus/cli-spinners) project. All the available spinners can be seen on the [jsfiddle](https://jsfiddle.net/sindresorhus/2eLtsbey/) provided in their README. Once you see one you like you can just copy the frames from the [spinners.json](https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json). Huge thank you to them, the animations are fantastic! 😄

_Remember that the speed of the animation is determined by the number of frames, if you keep the interval constant, but have less frames then it will appear faster and with more frames it will appear slower_

TODO
