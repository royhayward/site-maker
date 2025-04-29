declare module 'webpack-hot-middleware' {
  import { RequestHandler } from 'express';
  import { Compiler } from 'webpack';

  function middleware(compiler: Compiler, options?: {
    path?: string;
    log?: boolean | ((...args: any[]) => void);
    heartbeat?: number;
  }): RequestHandler;

  export = middleware;
}