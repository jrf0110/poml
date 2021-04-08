#! /bin/sh

cp README.md dist/README.md
cd ./dist

echo '*.test.js' > .npmignore

echo '{
  "name": "poml",
  "version": "1.0.3",
  "description": "Positional Markup Language - Simple markup for describing the position of components within a string.",
  "keywords": ["i18n", "internationalization", "markup", "language"],
  "main": "poml.js",
  "author": "jrf0110@gmail.com",
  "license": "MIT",
  "private": false,
  "dependencies": {
    "uuid": "^8.3.2"
  }
}
' > "package.json"

yarn publish

echo '{
  "name": "poml-react",
  "version": "1.0.3",
  "description": "React bindings for PoML (Positional Markup Language)",
  "keywords": ["i18n", "internationalization", "markup", "language"],
  "main": "poml-react.js",
  "author": "jrf0110@gmail.com",
  "license": "MIT",
  "private": false,
  "dependencies": {
    "uuid": "^8.3.2"
  },
  "peerDependencies": {
    "react": "*"
  }
}
' > "package.json"

yarn publish

cd ..