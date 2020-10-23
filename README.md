# eesti-helper
Check the spelling of learned Estonian words in three cases.

Currently works with russian translation.

## Goal
- simplify the study of words spelling
- learn React basics

## Dependencies
All words information taken from the EKI dictionaries:
- [Sõnaveeb](https://sonaveeb.ee/) : word three main cases
- [EVS Estonian-Russian dictionary](http://portaal.eki.ee/dict/evs/) : word translation

## Installation
To run the service, you need to install `docker` and` docker-compose` on your PC.

Run command in project root directory:
```
docker-compose up -d
```
That's all, visit http://localhost:8080 to start work.

## Usage
UI contains 3 tabs:
- **ADD** : add list of learned Estonian words.
- **LIST** : show all added words in their 3 main cases and translation.
  - ability to change the translation.
  - ability to add tags to words.
- **QUIZ** : check spelling of the learned words in 3 cases.
  - choose quiz words by type, tag or failed before words.
