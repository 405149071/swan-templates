/**
 * @license
 * Copyright Baidu Inc. All Rights Reserved.
 *
 * This source code is licensed under the Apache License, Version 2.0; found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @file 配置文件
 * @author yangjingjiu
 */

const path = require('path');
const devDestPath = path.join(__dirname, '../smartprogram_dev');
const destPath = path.join(__dirname, '../smartprogram');
const componentPath = path.join(__dirname, '../src');
const componentPathGlob = `${componentPath}/**/*`;
const componentDevPath = path.join(devDestPath, './components/test');
const framePath = path.join(__dirname, './demo');
const framePathGlob = `${framePath}/**/*`;
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJsonDestPath = path.join(devDestPath, './package.json');

module.exports = {
    devDestPath,
    destPath,
    componentPath,
    componentPathGlob,
    componentDevPath,
    framePath,
    framePathGlob,
    packageJsonPath,
    packageJsonDestPath
};