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
    ['module-resolver', {
      alias: {
        "@entities/*": "./src/entities/*",
        "@config/*": "./src/config/*",
        "@helpers/*": "./src/helpers/*",
        "@providers/*": "./src/providers/*",
        "@repositories/*": "./src/repositories/*",
        "@useCases/*": "./src/useCases/*",
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
