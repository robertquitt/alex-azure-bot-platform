var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../calhacks4-alex.zip');
var kuduApi = 'https://calhacks4-alex.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$calhacks4-alex';
var password = 'vAJBqDn3ehS7hSJpGHherxxx1DoSvi86tlEwK8AoP1kYcToHDG8llvswlqsL';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('calhacks4-alex publish');
  } else {
    console.error('failed to publish calhacks4-alex', err);
  }
});