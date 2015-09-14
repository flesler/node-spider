# Changelog

## 1.2.0
- Added `catchErrors` option, if true handlers will by try-catched and errors sent to `error` callback
- `logs` option can be any stream and the logs are written to it (stdout, stderr, file, etc)

## 1.1.0
- Added `delay` option to wait after each request
- Added `encoding` option to set the requests encoding

## 1.0.0
- Updated dependencies versions
- Duplicated URLs are ignored unless `allowDuplicates` is `true`
- Reversed `error()` callback's arguments