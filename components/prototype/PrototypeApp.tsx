"use client";

import { DemoProvider } from "./DemoProvider";
import { PrototypeRouter } from "./PrototypeRouter";

export function PrototypeApp() {
  return <DemoProvider><PrototypeRouter /></DemoProvider>;
}
