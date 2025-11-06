import Task from "./Task";
import { sleep } from "./util";

const taskClearCache = new Task("Clearing cache");
await sleep(5);
taskClearCache.done("Cache cleared")
const taskPrebuild = new Task("Prebuilding");
await sleep(5);
taskPrebuild.done("Prebuild complete");
