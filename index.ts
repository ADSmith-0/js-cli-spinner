import { withSpinner } from "./Task";

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
