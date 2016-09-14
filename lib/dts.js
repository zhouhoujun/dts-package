"use strict";
var path = require('path');
var through = require('through2');
var tsfmt = require('typescript-formatter');
/**
 * add reference typings for ts file.
 *
 * @param {string} typeingsFile
 * @returns
 */
function tsReference(typeingsFile) {
    return through.obj(function (file, encoding, callback) {
        // let relativePath = path.relative(file.cwd, file.path)
        var content = file.contents.toString();
        var typefile = path.relative(path.dirname(file.path), typeingsFile).replace(/\\/g, '/');
        // console.log('typefile relative path:',typefile, 'file path:', file.path, 'relativePath:',relativePath);
        content = ("///<reference path='" + typefile + "' />\n        ") + content;
        file.contents = new Buffer(content);
        callback(null, file);
    });
}
exports.tsReference = tsReference;
/**
 * declare module name for dts package.
 *
 * @param {string} packageName
 * @param {string} mainFile  package index file, main file.
 * @param {string} [sourceRoot]
 * @returns
 */
function dtsPackage(packageName, mainFile, sourceRoot) {
    sourceRoot = sourceRoot || '';
    packageName = packageName || '';
    return through.obj(function (file, encoding, callback) {
        transformFile(file, sourceRoot, packageName, mainFile, function (content) {
            file.contents = new Buffer(content);
            callback(null, file);
        });
    });
}
exports.dtsPackage = dtsPackage;
var transformFile = function (file, sourceRoot, packageName, mainFile, cb) {
    var relativePath = path.relative(file.cwd, file.path);
    var modulePath = getModuleNameByRelativePathBaseProject(relativePath, sourceRoot, packageName, mainFile);
    var content = file.contents.toString();
    content = removeDeclare(content);
    content = convertImport(content, file, sourceRoot, packageName, mainFile);
    content = "\n    declare module " + JSON.stringify(modulePath) + " {\n        " + content + "\n    }\n    ";
    tsfmt.processString('no-file', content, {}).then(function (result) {
        cb(result.dest);
    });
};
var removeDeclare = function (content) {
    return content.replace(/declare/g, '');
};
var convertImport = function (content, file, sourceRoot, packageName, main) {
    return content.replace(/(import.*?from)\s+["'](.*?)['"]/g, function (match, rest, reference) {
        if (reference[0] === '.') {
            var fileAbsolutePath = path.join(file.base, file.relative);
            var fileRelativePathBaseProject = path.relative(file.cwd, fileAbsolutePath);
            var dirRelativePathBaseProject = path.dirname(fileRelativePathBaseProject);
            var moduleName = getModuleNameByRelativePathBaseProject(path.join(dirRelativePathBaseProject, reference + '.d.ts'), sourceRoot, packageName, main);
            return rest + " " + JSON.stringify(moduleName);
        }
        else {
            return match;
        }
    });
};
var getModuleNameByRelativePathBaseProject = function (relativePathBaseProject, sourceRoot, packageName, mainname) {
    var pathBaseSourceRoot = path.relative(sourceRoot, relativePathBaseProject);
    // console.log(pathBaseSourceRoot); 
    var name = pathBaseSourceRoot
        .substr(0, pathBaseSourceRoot.length - '.d.ts'.length)
        .replace(/\\/g, '/');
    if (name === mainname) {
        return packageName;
    }
    else {
        return packageName + '/' + name;
    }
};
