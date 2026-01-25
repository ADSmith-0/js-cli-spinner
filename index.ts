import { withSpinner } from "./utils.ts";

await withSpinner({
  taskName: "Clearing Cache",
  cmd: "sleep 2; exit 2;",
  finishedText: "Cache cleared",
});

await withSpinner({
  taskName: "Running prebuild",
  cmd: 'sleep 2; echo "Prebuild failed!" >&2; exit 1;',
  finishedText: "Prebuilt",
});
