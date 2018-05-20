const plugins = [
  [
    "emotion",
    {
      hoist: true,
      autoLabel: true
    }
  ],
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-object-rest-spread"
];

const BABEL_ENV = process.env.BABEL_ENV;

if (BABEL_ENV === "serve") {
  plugins.push("dynamic-import-node");
} else {
  plugins.push("@babel/plugin-syntax-dynamic-import");
}

const config = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        modules: "commonjs",
        targets: {
          browsers: ["> 1%"]
        }
      }
    ]
  ],
  plugins
};

module.exports = config;
