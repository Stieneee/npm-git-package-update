
# npm-git-package-update

Update npm package depedancies that use git urls.

[Because this issue exists.](https://github.com/npm/npm/issues/18178)

## Install

```
npm i -g npm-git-package-update

or

npm i -D npm-git-package-update
```

## Usage
When installed gloablly the package is callable as `npm-git-package-update` or more simply `ngpu`.

If installed as a dev depedancy the package is callable using `npx npm-git-package-update`.

```
Usage: npm-git-package-update [options]

Options:
  -V, --version    output the version number
  -r, --recursive  recursively update package.json excluding node_modules and hidden folders
  -h, --help       output usage information
```

## Contributing

Pull request and issues are welcome.

## License

This project is licensed under the MIT License.