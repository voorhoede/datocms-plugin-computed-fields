# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [2.4.6] - 2023-07-10
### Fixed
- Make sure fields update if element is removed from link/block list
- Make sure fields update if link/block list is emptied
### Changed
- Updated script triggering mechanism (for each modified flattened path the code will be checked for presence of the oldest ancestor from the modified path up to the level where field holding the script resides). Please see example behavior below:
```
{
  computed_field
  text_field
  blocks {
    block_computed_field
    block_text_field
    inner_blocks {
      inner_block_text_field
    }
  }
}
```
| compute field	       | modified path	                                 | code checked for presence of |
  |----------------------|------------------------------------------------|------------------------------|
| computed_field       | textField                                      | textField                    |
| computed_field       | blocks.0.block_text                            | blocks                       |
| block_computed_field | textField                                      | ignored                      |
| block_computed_field | blocks.0.block_text                            | block_text                   |
| block_computed_field | blocks.0.inner_blocks.0.inner_block_text_field | inner_blocks                 |

## [2.4.5] - 2023-06-30
### Fixed
- Make sure fields update if they are used in modular content

## [2.4.4] - 2023-05-25
### Changed
- Rename readme.md to README.md

## [2.4.3] - 2023-05-16
### Changed
- Publish package signed with npm package provenance.

## [2.4.2] - 2023-04-04
### Security
- Update all dependencies to their latest version.

[2.4.6]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.5...v2.4.6
[2.4.5]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.4...v2.4.5
[2.4.4]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/f38ff75...v2.4.3
[2.4.2]: https://github.com/voorhoede/datocms-plugin-computed-fields/compare/dc0f6ac...f38ff75
