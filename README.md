# cdn Uploader

## Installing

### Global

**Yarn**
`yarn global add ty-cdn`

**Npm**
`npm install -g ty-cdn`

### Library

**Yarn**
`npm install ty-cdn`

**Npm**
`yarn add ty-cdn`

## Global Usage

```
Usage: cdn -t [str] -e [str] -f [str[]] -u [str]
-p [pwd]

Options:
  --help     Show help                       [boolean]
  --version  Show version number             [boolean]
  -t         team directory                 [required]
  -e         environment directory          [required]
  -b         build version
  -d         Absolute directory
  -f         list of files          [array] [required]
  -u         sftp username                  [required]
  -p         sftp password                  [required]
  -h         sftp host
  -w         sftp port
```

### Uploading files

**Basic Usage**

`cdn -u username -p password -t mobileweb -e develop -f library.js`

Uploads library js to cdn with `/username/mobileweb/develop/library.js`

**With Build Number**

`cdn -u username -p password -t mobileweb -e develop -b 123 -f library.js`

Uploads library js to cdn with `/username/mobileweb/develop/123/library.js`

**Absolute Directory**

`cdn -u username -p password -t mobileweb -e develop -d /absolute -f library.js`

Uploads library js to cdn with `/username/absolute/library.js`

**Multiple Files**

`cdn -u username -p password -t mobileweb -e develop -f library.js anotherlibrary.js`

Uploads library js to cdn with `/username/mobileweb/develop/library.js`
Uploads library js to cdn with `/username/mobileweb/develop/anotherlibrary.js`


## Library Usage

**Options**
```
const cdn = require('cdn');
const options = {
  team: 'mobileweb',
  environment: 'dev,
  buildVersion: '123', //optional
  user: 'username',
  password: 'password',
}
```

**Single file**
```
cdn.upload('~/acg/desktop/index.js', options);
```

**Array of files**
```
cdn.upload(['~/acg/desktop/index.js', '~/acg/desktop/library.json'], options);
```

**Object for custom configuration**
```
cdn.upload({
    source: '~/acg/desktop/index.js',
    remote: 'index.min.js'
}, options);
//File will be available with url: `/username/mobileweb/dev/index.min.js`
```

**Multiple objects for custom configuration**
```
cdn.upload([
  {
    source: '~/acg/desktop/index.js',
    remote: 'index.min.js'
  },
  {
    source: '~/acg/desktop/library.json',
    remote: 'library.min.json'
  }
], options);
//File will be available with url: `/username/mobileweb/dev/index.min.js`
//File will be available with url: `/username/mobileweb/dev/library.min.json
```
