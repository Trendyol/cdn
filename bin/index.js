#!/usr/bin/env node
const fileUploader = require('../lib/file-uploader');
const path = require("path");
const argv = require('yargs')
    .usage('Usage: $0 -t [str] -e [str] -f [str[]] -u [str] -p [pwd]')
    .describe('t', 'team directory')
    .describe('e', 'environment directory')
    .describe('b', 'build version')
    .describe('d', 'Absolute directory')
    .describe('f', 'list of files')
    .describe('u', 'sftp username')
    .describe('p', 'sftp password')
    .describe('h', 'sftp host')
    .describe('w', 'sftp port')
    .array('f')
    .demandOption(['t','e', 'f', 'u', 'p'])
    .argv;
const uploadFiles = argv.f.reduce((fileList, file) => {
    fileList.push(path.resolve(file));
    return fileList;
}, []);
fileUploader.upload(uploadFiles, {
    team: argv.t,
    environment: argv.e,
    buildVersion: argv.b,
    directory: argv.d,
    user: argv.u,
    password: argv.p,
    host: argv.h,
    port: argv.w
});
