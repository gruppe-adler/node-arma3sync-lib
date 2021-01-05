![tests](https://img.shields.io/github/workflow/status/gruppe-adler/node-arma3sync-lib/Node%20CI?label=tests)
[![codecov](https://codecov.io/gh/gruppe-adler/node-arma3sync-lib/branch/add-cc/graph/badge.svg)](https://codecov.io/gh/gruppe-adler/node-arma3sync-lib)


# node-arma3sync-lib

Read and write Arma3Sync `.a3s` config data using JavaScript.

```ts
const a3s = new A3sDirectory('/my/repo/path/.a3s/')
a3s.getEvents().then(events => { /*pure awesome*/});

```

