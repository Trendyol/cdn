const fs = require("fs");
const FtpClient = require("ftp");
const async = require("async");

const defaultOptions = {
    team: "common",
    environment: "dev",
    buildVersion: null,
    directory: null,
    host: "10.0.0.149"
};

const fetchFiles = (files, options, cb) => {
    const uploadTasks = [];
    async.forEach(files, (file, cbEach) => {
        const isObject = typeof file === "object";
        fs.readFile(isObject ? file.source : file, (err, data) => {
            uploadTasks.push({
                source: data,
                name: isObject ? file.remote : file.replace(/^.*[\\\/]/, "")
            });
            cbEach(err, uploadTasks);
        });
    }, err => {
        cb(err, uploadTasks, options);
    });
};

const connectFTP = (files, options, cb) => {
    console.log('Creating sftp client');
    const ftpClient = new FtpClient();
    ftpClient.on("ready", () => {
        cb(null, files, options, ftpClient);
    });
    ftpClient.on("err", err => {
        cb(err, files, options, ftpClient);
    });
    ftpClient.connect({
        host: options.host || defaultOptions.host,
        user: options.user,
        password: options.password
    });
};

const createWorkingDirectory = (files, options, ftpClient, cb) => {
    console.log(`Creating directory ${options.uploadDirectory} if not exists`);
    ftpClient.mkdir(options.uploadDirectory, true, err => {
        cb(err, files, options, ftpClient);
    });
};

const changeWorkingDirectory = (files, options, ftpClient, cb) => {
    console.log(`Changing directory to ${options.uploadDirectory}`);
    ftpClient.cwd(options.uploadDirectory, err => {
        cb(err, files, options, ftpClient);
    });
};

const uploadFiles = (files, options, ftpClient, cb) => {
    async.forEach(files, (file, cbEach) => {
        console.log(`Uploading ${file.name} to ${options.uploadDirectory}`);
        ftpClient.put(file.source, file.name, err => {
            if (!err) {
                console.log(`Access link: https://static.dsmcdn.com/${options.user}${options.uploadDirectory.substr(1)}${file.name}`);
            }
            cbEach(err);
        });
    }, err => cb(err, ftpClient));
};

const uploadWaterfall = (files, options, cb) => {
    async.waterfall([
        cb => cb(null, files, options),
        fetchFiles,
        connectFTP,
        createWorkingDirectory,
        changeWorkingDirectory,
        uploadFiles
    ], (err, ftpClient) => {
        if (!err) {
            ftpClient.destroy();
            console.log("Files are uploaded successfully");
            cb && cb(null);
        } else {
            if (cb) {
                cb && cb(err);
            } else {
                throw new Error(err);
            }
        }
    });
};

const getWorkDir = (team, environment, buildVersion) => {
    const basePath = `~/${team}/${environment}/`;
    if (buildVersion) {
        return path.json(basePath, buildVersion);
    } else {
        return basePath;
    }
};

const upload = (files, options = defaultOptions, cb) => {
    const uploadOptions = {
        uploadDirectory: options.directory || getWorkDir(options.team, options.environment, options.buildVersion),
        ...options
    };
    if (Array.isArray(files)) {
        uploadWaterfall(files, uploadOptions, cb);
    } else if (typeof files === "string") {
        uploadWaterfall([files], uploadOptions, cb);
    } else if (typeof files === "object") {
        uploadWaterfall([files], uploadOptions, cb);
    }
};

module.exports = {
    upload
};
