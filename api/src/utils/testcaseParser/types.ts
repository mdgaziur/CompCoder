import { testcaseMetaType } from "./../../judging-engine/types";

export type returnType = {
  success: Boolean;
  meta?: testcaseMetaType[];
  reason?: number;
};
