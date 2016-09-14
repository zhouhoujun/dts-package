/**
 * add reference typings for ts file.
 *
 * @param {string} typeingsFile
 * @returns
 */
export declare function tsReference(typeingsFile: string): any;
/**
 * declare module name for dts package.
 *
 * @param {string} packageName
 * @param {string} mainFile  package index file, main file.
 * @param {string} [sourceRoot]
 * @returns
 */
export declare function dtsPackage(packageName: string, mainFile: string, sourceRoot?: string): any;
