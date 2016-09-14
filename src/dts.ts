import * as path from 'path';
import * as through from 'through2';
const tsfmt = require('typescript-formatter');


/**
 * add reference typings for ts file.
 * 
 * @param {string} typeingsFile
 * @returns
 */
export function tsReference(typeingsFile: string) {
    return through.obj((file, encoding, callback) => {
        // let relativePath = path.relative(file.cwd, file.path)
        let content = file.contents.toString();
        let typefile = path.relative(path.dirname(file.path), typeingsFile).replace(/\\/g, '/');
        // console.log('typefile relative path:',typefile, 'file path:', file.path, 'relativePath:',relativePath);
        content = `///<reference path='${typefile}' />
        ` + content;

        file.contents = new Buffer(content);
        callback(null, file);
    });
}
/**
 * declare module name for dts package.
 * 
 * @param {string} packageName
 * @param {string} mainFile  package index file, main file.
 * @param {string} [sourceRoot]
 * @returns
 */
export function dtsPackage(packageName: string, mainFile: string, sourceRoot?: string) {
    sourceRoot = sourceRoot || '';
    packageName = packageName || '';

    return through.obj((file, encoding, callback) => {
        transformFile(file, sourceRoot, packageName, mainFile, (content) => {
            file.contents = new Buffer(content);
            callback(null, file);
        });
    });
}


const transformFile = (file, sourceRoot: string, packageName: string, mainFile: string, cb) => {
    var relativePath = path.relative(file.cwd, file.path);
    var modulePath = getModuleNameByRelativePathBaseProject(relativePath, sourceRoot, packageName, mainFile);

    var content = file.contents.toString();
    content = removeDeclare(content);
    content = convertImport(content, file, sourceRoot, packageName, mainFile);
    content = `
    declare module ${JSON.stringify(modulePath)} {
        ${content}
    }
    `;

    tsfmt.processString('no-file', content, {}).then((result) => {
        cb(result.dest);
    });
};

const removeDeclare = (content) => {
    return content.replace(/declare/g, '');
};

const convertImport = (content, file, sourceRoot, packageName, main) => {
    return content.replace(/(import.*?from)\s+["'](.*?)['"]/g, (match, rest, reference) => {
        if (reference[0] === '.') {
            var fileAbsolutePath = path.join(file.base, file.relative);
            var fileRelativePathBaseProject = path.relative(file.cwd, fileAbsolutePath);
            var dirRelativePathBaseProject = path.dirname(fileRelativePathBaseProject);
            var moduleName = getModuleNameByRelativePathBaseProject(path.join(dirRelativePathBaseProject, reference + '.d.ts'), sourceRoot, packageName, main);
            return `${rest} ${JSON.stringify(moduleName)}`;
        } else {
            return match;
        }
    });
};

const getModuleNameByRelativePathBaseProject = (relativePathBaseProject, sourceRoot, packageName, mainname) => {
    var pathBaseSourceRoot = path.relative(sourceRoot, relativePathBaseProject);
    // console.log(pathBaseSourceRoot); 
    let name = pathBaseSourceRoot
        .substr(0, pathBaseSourceRoot.length - '.d.ts'.length)
        .replace(/\\/g, '/');
    if (name === mainname) {
        return packageName;
    } else {
        return packageName + '/' + name;
    }
};
