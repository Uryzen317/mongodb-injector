Deprecated. Dont use
<p align="center">
  Mongodb-injector
</p>

## Description

Mongodb-injector will export/import data available in a mongodb database in json format.

## Installation

```bash
# download / clone the project
$ git clone ...

# install required packages via npm
$ npm install
```

## Usage

```bash
# setup connection
# fill the required data in the .env file (host, port, ...)

# to export data from a mongodb database
# run the following command (export.json --> final file name)
$ node index.js -e export.json

# to import data into a mongodb database
# run the following command (import.json --> the file containing desired data)
$ node index.js -i import.json
```
