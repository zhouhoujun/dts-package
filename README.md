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

MIT © [Houjun](https://github.com/zhouhoujun/)