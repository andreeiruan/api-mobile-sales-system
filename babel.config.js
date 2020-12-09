module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ['module-resolver', {
      alias: {
        "@entities": "./src/app/entities",
        "@config": "./src/config",
        "@helpers": "./src/app/helpers",
        "@providers": "./src/app/providers",
        "@repositories": "./src/app/repositories",
        "@useCases": "./src/app/useCases",
        "@errors": "./src/app/helpers/errors",
        "@app": "./src/app",
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts',
    'src/database/migrations/*.ts'
  ]
}
