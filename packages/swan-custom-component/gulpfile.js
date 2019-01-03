/**
 * @license
 * Copyright Baidu Inc. All Rights Reserved.
 *
 * This source code is licensed under the Apache License, Version 2.0; found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @file gulpfile
 * @author yangjingjiu
 */

const gulp = require('gulp');
const clean = require('gulp-clean');
const config = require('./tools/config');
const Tasks = require('./tools/tasks');

const tasks = new Tasks();

gulp.task('clean', () => {
    return gulp
        .src(config.devDestPath, {read: false, allowEmpty: true})
        .pipe(clean());
});

gulp.task('dev', gulp.series('s-dev'));

gulp.task('watch', gulp.series('s-watch'));

gulp.task('default', gulp.series('dev'));