# Sewio Homework

## Env setup

```shell
npm install
```

## Running tests

Env variables for `username` and `password` must be either changed in `cypress.config.ts`
or provided via commandline parameters.

### Headful

```shell
npm run cy:open
```

or

```shell
npm run cy:open -- --env username=demo_username,password=demo_password
```

### Headless

```shell
npm run cy:run
```

or

```shell
npm run cy:run -- --env username=demo_username,password=demo_password
```
