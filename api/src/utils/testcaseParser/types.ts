export type metaType = {
  [key: number]: {
    input: string;
    output: string;
  };
};

export type returnType = {
  success: Boolean;
  meta?: metaType;
  reason?: number;
};
