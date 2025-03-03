# 📚 Overseer Client Contribution Guide

Welcome to the Overseer Client project contribution guide. This guide will help you about how to contribute to this project.

---

## ⚠️ Before you start

Before you start contributing in this project, make sure to read the contribution guidelines for this project.

### ✅ Do

- Have a minimum experience with TypeScript and some technologies used in this project. (Depending in what you want to contribute)
- Use the Biome's linter and formatter.
- Follow the project's code style and conventions.

### ❌ Do not

- Duplicate existing Pull Requests.
- Change configuration files. (Such as `.gitignore`, `.editorconfig`, and more...)
- Create Pull Requests that fix typos or broken links. Instead create an issue and we will fix it.
- Create Pull Requests that are not related to the project.
- Use a different code style, format or convention than the one used in this project.

---

## 🛠️ Stack

This project has been built using the following technologies:

- [TypeScript][TypeScriptWebsite]: A strongly typed programming language that builds on JavaScript.
- [Discordeno][DiscordenoWebsite]: A Node.js library to interact with the Discord API.
- [PNPM][PNPMWebsite]: A fast and efficient package manager.
- [i18next][i18nextWebsite]: A internationalization framework for JavaScript.
- [Nest.js][NestJsWebsite]: A progressive Node.js framework for building server-side applications.

---

## ✨ Code Linting and Formatting

This project uses the Biome's [linter][BiomeLinterWebsite] and [formatter][BiomeFormatterWebsite] to ensure consistency and readability in the code.

## 📟 Scripts

This project contains some scripts in the `package.json` file to help you during the development.

- `aliases`: Converts the paths from the `tsconfig.json` into relative paths.
- `build`: Executes the `clean`, `check:typescript`, `swc`, and `aliases` scripts.
- `check:typescript`: Checks the TypeScript code for errors.
- `clean`: Deletes the `dist` folder.
- `dev`: Runs the compiled JavaScript files using the Nodemon watch mode.
- `prisma:generate`: Generates the Prisma client.
- `prisma:studio`: Opens the Prisma Studio to visualize and edit the database documents.
- `start`: Runs the compiled JavaScript files.
- `swc`: Compiles the TypeScript code into JavaScript using the SWC compiler.

[BiomeFormatterWebsite]: https://biomejs.dev/formatter/
[BiomeLinterWebsite]: https://biomejs.dev/linter/
[DiscordenoWebsite]: https://discordeno.js.org/
[NestJsWebsite]: https://nestjs.com/
[PNPMWebsite]: https://pnpm.io/
[TypeScriptWebsite]: https://www.typescriptlang.org/
[i18nextWebsite]: https://www.i18next.com/
