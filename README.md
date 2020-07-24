# eesti-helper
Check the spelling of learned Estonian words in three cases.

Currently works with rus translation.

## Goal
- sinplify the study of words spelling
- learn React basics

## Dependencies
All words information taken from the EKI dictionaries:
- [Sõnaveeb](https://sonaveeb.ee/) : word three main cases
- [EVS Estonian-Russian dictionary](http://portaal.eki.ee/dict/evs/) : word translation

## Installation
For installation you need have `docker` and `docker-compose` be installed in your PC.

Build and deployment command in root directory:
```
docker-compose up -d
```
That's all, visit http://localhost:8080 to start use it.

## Usage
UI contains 3 tabs:
- ADD : add list of learned Estonian words
- LIST: show all added words in their 3 main cases and translation
- QUIZ: check spelling of the learned words in 3 cases
