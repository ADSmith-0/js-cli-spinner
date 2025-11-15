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

## Features
The purpose of this library is to work collaboratively with any command that's run. If the command is successful then it should complete and move onto the next command, however if the command is not successful, then we should exit the script and bubble up the error to the dev. If the spinner is hiding errors from us then it doesn't do us much good

How `withSpinner` works is that it will listen to the `stdout`, `stderr` and `code` for the command that's being executed. To briefly explain:

- `stdin` - The standard input stream for the program, this is the command line where you type in your command such as `echo "hello"`
- `stdout` - The standard output stream for the program, this is what's returned from the command, for example if we run the command above `echo "hello"`, the `stdout` would be `hello`
- `stderr` - The standard error stream, similar to the `stdout`, but will capture only the errors for a commands output
- `code` - The code that the program returns, `0` is successful, `1` is an general error, there are more codes and more specific codes, but those are the common ones to run into

This isn't perfect unfortunately as it's down the person writing the scripts to use these streams as intended. I've seen scripts which error with a code `0` and scripts which succeed with no code returned. Which is why there's a bit more going on in the `Spinner.ts` file than simply reading the codes. However what this does mean is that when we get an error code back, we can fail the command then print out the errors that we received from the errored script to help us understand what went wrong

This is what can be seen above with
```bash
sleep 2; echo "Process exited with an error!" >&2; exit 1;
```

Here we run 3 commands one after another:
- `sleep 2` - Pause the script for 2 seconds, to allow the spinner to show
- `echo "Process exited with an error!" >&2`, the `>&2` means pipe the output of the previous command, the `echo`, into `stderr`
- `exit 1` - Exit with code `1`, which is an error

Then the outcome as you can see from above is that the process will display our `stderr` and stop execution. What this means in practice is that you should be able to run any command with the `withSpinner` function and it will pass on the error that's printed from the command

## Why library-less?
It's honestly just far easier. A lot of projects and orgs have specific rules about which libraries can be included, and this isn't intended to be massive and comprehesive. Rather it's intended to be a small tool to make long npm scripts, that run multiple steps, much easier to read and understand. Any modifications you want such as different colours, text, spinners, etc, can all be achieved very easily through the recipes section, something which would be much harder to do if it was abstracted behind an interface

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
The ASCII colours apply to everything before the `RESET`, so if you move it further down the line you can get colourful text as well

```ts
`\r${BOLD_BLUE}${FRAMES[i++ % FRAMES.length]} ${taskName}...${RESET}`,
```

[Colourful_Text.webm](https://github.com/user-attachments/assets/4f312a90-ac67-4944-bca2-f18ce6952a6c)

### Spinner
You can easily grab one from the fantastic [cli-spinners](https://github.com/sindresorhus/cli-spinners) project. All the available spinners can be seen on the [jsfiddle](https://jsfiddle.net/sindresorhus/2eLtsbey/) provided in their README. Once you see one you like you can just copy the frames from the [spinners.json](https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json). Huge thank you to them, the animations are fantastic! 😄

_Remember that the speed of the animation is determined by the number of frames. If you keep the interval constant, but have less frames then it will appear faster and with more frames it will appear slower_

### Circle Halves

```ts
const FRAMES = ["◐", "◓", "◑", "◒"];
```

[CircleHalves.webm](https://github.com/user-attachments/assets/2bc10ded-cb65-400b-9d91-79842c078ee6)

### Scrolling dots
```ts
const FRAMES = [".  ", ".. ", "...", " ..", "  .", "   "];
const INTERVAL = 110;
```

[ScrollingDots.webm](https://github.com/user-attachments/assets/4725c42c-0444-445b-9356-33532e369938)

