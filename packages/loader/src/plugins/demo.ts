import { WebpackPluginInstance, Compiler } from 'webpack';

// 参数验证

class MD2JsonmlAppendDemoPlugin implements WebpackPluginInstance {
  private readonly options!: any;
  private readonly pluginName = 'MD2JsonmlAppendDemoPlugin';

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const { compilerPath, context, immutablePaths } = compiler;
    compiler.compilerPath;
    console.log('option: ', this.options, compilerPath, context, immutablePaths);

    // 初始化 compilation
    compiler.hooks.thisCompilation.tap(this.pluginName, compilation => {
      // 添加资源的hooks
      compilation.hooks.additionalAssets.tapAsync(this.pluginName, cb => {
        console.log('添加资源的hooks: ');
        cb();
      });
    });
  }
}

export default MD2JsonmlAppendDemoPlugin;
