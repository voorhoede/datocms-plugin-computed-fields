# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.1] - 2026-09-30
### Fixed
- Recompute each field at most once per settled edit (300 ms debounce, one run at a time), instead of re-running on every re-render while a run is pending. This could exhaust the editor's API rate limit and slow down the whole CMS
- A field's own write no longer re-triggers its code
- Discard results of runs superseded by a newer edit
- Show errors thrown by the field code in the field, and don't write a value, instead of re-running endlessly
- Skip writing values that are already up to date
- `getModel`, `getUpload` and `getModelType` call the CMA of the CMS instance the plugin runs in (`ctx.cmaBaseUrl`), instead of always calling `site-api.datocms.com`

### Changed
- `getModel` calls made in parallel (e.g. inside `Promise.all`) are sent as a single CMA request
- When several dependencies change within the debounce window, the code runs once and `changedField` holds the path of the most recent one

## [2.7.0] - 2026-06-17
### Added
- Dark mode support

## [2.6.0] - 2026-04-04
### Added
- Model type helper

## [2.5.1] - 2023-08-11
### Security
- Update all dependencies to their latest version

## [2.5.0] - 2023-07-11
### Added
- Prettier for code styling
- Jest
- A git workflow for testing
- Test for objectDifference function
### Security
- Update all dependencies

## [2.4.6] - 2023-07-10
### Fixed
- Make sure fields update if element is removed from link/block list
- Make sure fields update if link/block list is emptied
- objectDifference.ts typo

## [2.4.5] - 2023-06-30
### Fixed
- Make sure fields update if they are used in modular content

## [2.4.4] - 2023-05-25
### Changed
- Rename readme.md to README.md

## [2.4.3] - 2023-05-16
### Changed
- Publish package signed with npm package provenance

## [2.4.2] - 2023-04-04
### Security
- Update all dependencies to their latest version

[2.7.1]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.6...v2.5.0
[2.4.6]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.5...v2.4.6
[2.4.5]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.4...v2.4.5
[2.4.4]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/f38ff75...v2.4.3
[2.4.2]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/dc0f6ac...f38ff75
