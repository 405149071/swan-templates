/**
 * @license
 * Copyright Baidu Inc. All Rights Reserved.
 *
 * This source code is licensed under the Apache License, Version 2.0; found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @file 入口文件
 * @author yangjingjiu
 */

const gulp = require('gulp');
const config = require('./config');
const fs = require('fs-extra');
const gInstall = require('gulp-install');
const path = require('path');

/**
 * copy 文件
 * @param {string} srcPath 源文件地址
 * @param {string} destPath 目标文件地址
 * @return {stream}
 */
function copy(srcPath, destPath) {
    return gulp.src(srcPath, {allowEmpty: true})
        .pipe(gulp.dest(destPath, {overwrite: true}));
}

/**
 * copy 文件后安装依赖
 * @return {stram}
 */
function install() {
    return gulp.series(async () => {
        try {
            const packageObj = await fs.readJson(config.packageJsonPath);
            const dir = path.parse(config.packageJsonDestPath).dir;
            await fs.ensureDir(dir);
            await fs.writeJson(config.packageJsonDestPath, packageObj);
        } catch (error) {
            console.log(error);
        }
    }, () => {
        return gulp.src(config.packageJsonDestPath, {allowEmpty: true, base: config.devDestPath, cwd: config.devDestPath}).pipe(gInstall({production: true}));
    });
}

/**
 * 获取文件copy后文件地址
 * @param {string} file 文件路径
 * @param {string} relative 相对文件路径
 * @param {string} dir 输出路径文件夹目录
 * @return {Object} 返回目标文件路径和文件夹路径
 */
function getDest(file, relative, dir) {
    const relativePath = path.relative(relative, file);
    const realPath = formatPath(path.join(dir, relativePath));
    return {
        path: realPath,
        dir: path.parse(realPath).dir
    };
}

/**
 * 获取获取copy后文件地址函数
 * @param {string} relative 相对文件路径
 * @param {*} dir 输出文件夹路径
 * @return {function(string)} 返回获取地址函数
 */
function getDestFn(relative, dir) {
    return file => {
        return getDest(file, relative, dir);
    };
}

function formatPath(pathStr) {
    const arr = pathStr.split(path.sep);
    return arr.join('/');
}

class Tasks {
    constructor() {
        this.init();
    }

    init() {
        gulp.task('copy-demo-to-dev', done => {
            copy(config.framePathGlob, config.devDestPath);
            return done();
        });
        gulp.task('copy-component-to-dev', done => {
            copy(config.componentPathGlob, config.componentDevPath);
            return done();
        });
        gulp.task('copy-to-dev', gulp.series('copy-demo-to-dev', 'copy-component-to-dev'));

        gulp.task('install', install());

        gulp.task('watch-demo', () => {
            const destFn = getDestFn(config.framePath, config.devDestPath);
            const cb = function(file) {
                const destDir = destFn(file).dir;
                copy(file, destDir);
            };
            return gulp.watch(formatPath(path.join(__dirname, './demo/**/*')))
                .on('change', cb)
                .on('add', cb)
                .on('unlink', file => {
                    const delePath = destFn(file).path;
                    fs.removeSync(delePath);
                });
        });

        gulp.task('watch-component-src', (relative, dir) => {
            const destFn = getDestFn(config.componentPath, config.componentDevPath);
            const cb = function(file) {
                const destDir = destFn(file).dir;
                copy(file, destDir);
            };
            return gulp.watch(formatPath(path.join(__dirname, '../src/**/*')))
                .on('change', cb)
                .on('add', cb)
                .on('unlink', file => {
                    const delePath = destFn(file).path;
                    fs.removeSync(delePath);
                });
        });

        gulp.task('s-dev', gulp.series('copy-to-dev', 'install'));
        gulp.task('s-watch', gulp.series('s-dev', gulp.parallel('watch-demo', 'watch-component-src')));
    }
}

module.exports = Tasks;