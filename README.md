# Document Tracker

Internal Document Tracker for the Office of the University Registrar of the
University of the Philippines Baguio

## Running

We use `Makefile` to automate tasks. Invoke the following command to run the
client and initialize the database on **development** mode.

```bash
make run
```

To run the application in **production**, invoke

```bash
make run MODE=prod
```

## Adding Components

```bash
npx shadcn-svelte@latest add <component>
```

## Adding Fonts

Fonts are managed using [FontSource](https://fontsource.org/). To add fonts, simply do

```bash
npm install @fontsource/<fontname>
```
