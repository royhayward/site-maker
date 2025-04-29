declare module 'webpack' {
  interface Configuration {
    mode?: 'development' | 'production';
    entry?: string | string[] | { [key: string]: string };
    output?: {
      path?: string;
      filename?: string;
      publicPath?: string;
    };
    module?: {
      rules?: Array<{
        test?: RegExp;
        exclude?: RegExp;
        use?: string | { loader: string; options?: any }[];
      }>;
    };
    resolve?: {
      extensions?: string[];
      alias?: { [key: string]: string };
    };
    plugins?: any[];
    devtool?: string;
  }
}

export = webpack;
