# eesti-helper
Check the spelling of learned Estonian word.
Currently works with rus translation.

## Goal
- sinplify the study of words spelling
- learn React basics

## Dependencies
All words information taken from the EKI dictionaries:
- [Sõnaveeb](https://sonaveeb.ee/) : word three main cases
- [EVS Estonian-Russian dictionary](http://portaal.eki.ee/dict/evs/) : word translation

## Installation
For installation you need had `docker` and `docker-compose` installed in your PC.
Build and deployment command in root directory:
```
docker-compose up -d
```
That's all, visit http://localhost:8080 to start use it.

## Usage
UI contains 3 tabs:
- ADD : where you can add all your new learned words
- LIST: show list of all added words
- QUIZ: check spelling of learned words
