type LoggerParams = {
  fileName: string;
  lineNo: number;
  description: string;
};

export interface LoggerArgs {
  debug(params: LoggerParams): void;
  info(params: LoggerParams): void;
  warn(params: LoggerParams): void;
  error(params: LoggerParams): void;
}

export enum LOG_TYPE {
  DEBUG = "DEBUG",
  ERROR = "ERROR",
  INFO = "INFO",
  WARN = "WARN",
  VERBOSE = "VERBOSE",
}

class Logger implements LoggerArgs {
  level: LOG_TYPE | string;
  constructor(level: LOG_TYPE | string = LOG_TYPE.DEBUG) {
    this.level = level;
  }

  debug({ fileName, lineNo, description }: LoggerParams) {
    console.log(`[LOG] <${fileName}> : <${lineNo}> : <${description}>`);
  }

  info({ fileName, lineNo, description }: LoggerParams) {
    console.info(
      `[INFO] <${fileName}> : <${lineNo}> : <${description}>`,
      "color" + "DodgerBlue",
      "background-color: " + "Turquoise"
    );
  }

  warn({ fileName, lineNo, description }: LoggerParams) {
    console.log(`[WARN] <${fileName}> : <${lineNo}> : <${description}>`);
  }

  error({ fileName, lineNo, description }: LoggerParams) {
    console.log(`[ERROR] <${fileName}> : <${lineNo}> : <${description}>`);
  }
}
