#!/usr/bin/env node

module.exports = function (context) {
    var fs = require('fs'),
        path = require('path'),
        platformRoot = path.join(context.opts.projectRoot, 'platforms/android'),
        manifestFile = path.join(platformRoot, 'AndroidManifest.xml');

    if (fs.existsSync(manifestFile)) {
        fs.readFile(manifestFile, 'utf8', function (err, data) {
            if (err) {
                throw new Error('Unable to find AndroidManifest.xml: ' + err);
            }
            if (!(/<application[^>]*\bandroid:banner/).test(data)) {
                console.log('Adding banner attribute');
                data = data.replace(/<application/g, '<application android:banner="@drawable/banner"');
            }
            if (!(/<application[^>]*\bandroid:isGame/).test(data)) {
                console.log('Adding isGame attribute');
                data = data.replace(/<application/g, '<application android:isGame="false"');
            }
            // Corrigir receiver para incluir android:exported="true"
            const receiverRegex = /(<receiver[^>]+SmsRetrieverBroadcastReceiver[^>]+)(?<!android:exported="true")/g;
            if (receiverRegex.test(data)) {
                console.log('Adding android:exported="true" to SmsRetrieverBroadcastReceiver');
                data = data.replace(receiverRegex, `$1 android:exported="true"`);
            }
            fs.writeFile(manifestFile, data, 'utf8', function (err) {
                if (err) throw new Error('Unable to write into AndroidManifest.xml: ' + err);
            })
        });
    }
};
