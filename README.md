# packaged dts-package

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/dts-package/src/mastert).
Please file issues and pull requests against that repo.

This package use to help typescript compile with dts.
can publish dts with package module name.

## Install

You can install this package either with `npm` or with `jspm`.

### npm

```shell
dependencies: {
  "dts-package": "https://github.com/zhouhoujun/dts-package.git#commit-ish"
}
npm install
```

### compile jspm package module example
```js
import  { tsReference, dtsPackage } from 'dts-package';

let tsResult = gulp.src('src')
  //...
  .pipe(tsReference('./typings/index.d.ts'))
  .pipe(ts({...}));

return merge([
        // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts
          .pipe(dtsPackage(
             //packageName
            'jspm_package_name',
            //main file name,
            'app',
            //sourceRoot,
            //''
          ))
          .pipe(gulp.dest('dest')),

        tsResult.js.pipe(gulp.dest('dest'))
    ]);
```


## Documentation

Documentation is available on the
[dts-package docs site](https://github.com/zhouhoujun/dts-package).

## License

The MIT License

Copyright (c) 2010-2015 Google, Inc. http://www.skspruce.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
