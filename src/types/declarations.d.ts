declare module 'webpack-hot-middleware' {
  import { RequestHandler } from 'express';
  import { Compiler } from 'webpack';

  interface Options {
    path?: string;
    timeout?: number;
    overlay?: boolean;
    reload?: boolean;
    noInfo?: boolean;
    quiet?: boolean;
    dynamicPublicPath?: boolean;
    autoConnect?: boolean;
    overlayStyles?: object;
    overlayWarnings?: boolean;
    log?: Function;
    warn?: Function;
  }

  function webpackHotMiddleware(
    compiler: Compiler,
    options?: Options
  ): RequestHandler;

  export = webpackHotMiddleware;
}

declare module 'webpack-dev-middleware';
