![tests](https://img.shields.io/github/workflow/status/gruppe-adler/node-arma3sync-lib/Node%20CI?label=tests)
[![codecov](https://codecov.io/gh/gruppe-adler/node-arma3sync-lib/branch/add-cc/graph/badge.svg)](https://codecov.io/gh/gruppe-adler/node-arma3sync-lib)


# node-arma3sync-lib

Read and write [Arma3Sync](svn://www.sonsofexiled.fr/repository/ArmA3Sync/trunk) `.a3s` config data using JavaScript.

```ts
const a3s = new A3sDirectory('/my/repo/path/.a3s/')
a3s.getEvents().then(events => { /*pure awesome*/});

```

## Configuration

Currently uses [config](https://www.npmjs.com/package/config) and expects this config structure to exist:

```js
{
  "arma3sync-lib": {
    "publicURL": "", // public repository URL, ex. `http://mods.my-clan.com/`
    "repoName": "", // repository name
    "repoPath": "" // file path to the repository, ex. `/var/lib/a3s/mods`
  }
}
```
