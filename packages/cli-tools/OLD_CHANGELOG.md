# Old Changelog

Versions before 7.0.0 and below are collected into this file. Changelogs for
newer versions of the cli-tool are available at the root-level CHANGELOG.md
file.

## [6.1.1] - 2022-11-03

### Fixed

- Fix `streamr governance vote` command


## [6.1.0] - 2022-10-31

### Added

- Add command `streamr governance vote` for casting votes on Streamr governance proposals


## [6.0.0] - 2022-02-23

- Add new command `stream wallet whoami` to display Ethereum address
- (Breaking) `stream create` argument is a stream ID, not a name
- Support path notation when defining a stream ID
- (Breaking) Remove `misc get-session-token` command
- (Breaking) Change permission names and arguments:
  - renamed `--operation` to `--permission` in `stream list`
  - the data format of `permissions` returned by `--include-permissions` of `stream show` 
  - enum values updated for all commands: `subscribe`, `publish`, `edit`, `delete` and `grant`
- (Breaking) Remove `lastUpdated` and `name` columns from `stream list` output
- (Breaking) Modify configuration management:
  - can read config from `~/.streamr/config/default.json`
  - `--config` argument added
  - `--stg`, `--http-url` and `--ws-url` arguments removed
- (Breaking) Rename `--config` argument to `--stream-config` in `stream create`
- (Breaking) Remove `stream list` command
- Add `stream search` command
- (Breaking) Rename `--partition-key` argument to `--partition-key-field` in `stream publish`
- Bump dependency streamr-client to 6.1.0
- Bump dependency commander to 8.3.0

## 5.0.1 - 2021-06-04

- Add permission commands: `stream grant-permission` and `stream revoke-permission`
- Remove `typescript` and `ts-node` as run-time dependencies
- (Breaking) Remove `--msg-chain-id` parameter from `stream resend from`


## [5.0.0] - 2021-05-05

### Added
- Add storage node commands under `streamr storage-node`

### Changed
- (Breaking) Commands are divided to subcommands: most of the existing command are under `streamr stream`, and `generate` command under `streamr mock-data`
  - `streamr subscribe` is now `streamr stream subscribe`
  - `streamr publish` is now `streamr stream publish`
  - `streamr list` is now `streamr stream list`
  - `streamr show` is now `streamr stream show`
  - `streamr create` is now `streamr stream create`
  - `streamr resend` is now `streamr stream resend`
  - `streamr generate` is now `streamr mock-data generate`
- Fixed examples of --private-key in README
- Internal implementation was converted to TypeScript
- Bump dependency streamr-client to 5.2.1
- Bump dependency commander to 7.2.0


## [4.1.1] - 2021-02-11

### Changed
- Bump dependency streamr-client to 5.0.0-beta.6
- Bump dependency commander to ^6.1.0


## [4.1.0] - 2020-10-12

### Changed
- Bump dependency streamr-client to ^4.1.1.
- Turn option `--privateKey` into `--private-key` for consistency.
- Turn `--apiKey` into `--api-key` for consistency.


## [4.0.0] - 2020-06-18

### Added

- Ethereum authentication with `--privateKey <key>`. This also enables message signing when publishing messages.

### Changed

- (Breaking) Rename command `listen` to `subscribe`.
- (Breaking) API key is now given with `--apiKey <key>`. API keys are deprecated. Option `--privateKey` should be preferred.

## [3.1.1] - 2020-04-16

### Added

- Add `--subscribe` flag to commands `streamr resend from` and `streamr resend last`. This causes the command to resend and subscribe. 

### Changed

- Bump dependency streamr-client to ^3.1.3.


## [3.1.0] - 2019-12-12

### Added

- Add `--disable-ordering` flag to command `streamr listen` for disabling
ordering and gap filling.
- Add `--disable-ordering` flag to commands `streamr resend *` to disabling
ordering and gap filling.


## [3.0.1] - 2019-10-14

### Added

- Start keeping a CHANGELOG.md.

### Changed
- Bump dependency streamr-client to ^2.2.7.
- Bump dependency commander to ^4.0.1.
- Re-organize README.md and a few touches to Developing section paragraphs.


[Unreleased]: https://github.com/streamr-dev/network/compare/cli-tools%2fv8.3.1...HEAD
[8.3.1]: https://github.com/streamr-dev/network/compare/cli-tools%2fv7.0.0...cli-tools%2fv8.3.1
[7.0.0]: https://github.com/streamr-dev/network/compare/cli-tools%2fv6.1.1...cli-tools%2fv7.0.0
[6.1.1]: https://github.com/streamr-dev/network/compare/cli-tools%2fv6.1.0...cli-tools%2fv6.1.1
[6.1.0]: https://github.com/streamr-dev/network/compare/cli-tools%2fv6.0.0...cli-tools%2fv6.1.0
[6.0.0]: https://github.com/streamr-dev/network/compare/cli-tools%2fv5.0.1...cli-tools%2fv6.0.0
[5.0.0]: https://github.com/streamr-dev/cli-tools/compare/v4.1.1...v5.0.0
[4.1.1]: https://github.com/streamr-dev/cli-tools/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/streamr-dev/cli-tools/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/streamr-dev/cli-tools/compare/v3.1.1...v4.0.0
[3.1.1]: https://github.com/streamr-dev/cli-tools/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/streamr-dev/cli-tools/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/streamr-dev/cli-tools/compare/v3.0.0...v3.0.1
