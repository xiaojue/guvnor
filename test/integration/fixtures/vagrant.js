'use strict'

const path = require('path')
const run = require('./run')
const find = require('./find')
const VM_NAME = 'virtualbox'
const VAGRANT_FILE_DIRECTORY = path.resolve(path.join(__dirname, '..', '..', '..'))

const isVagrantRunning = (vagrant) => {
  return run(vagrant, ['status'], {
    cwd: VAGRANT_FILE_DIRECTORY
  })
  .then((stdout) => {
    return stdout.indexOf(VM_NAME) !== -1 && stdout.indexOf('running') !== -1
  })
}

const installVbGuestPlugin = (vagrant) => {
  console.info('Looking for vbguest plugin')
  return run(vagrant, ['plugin', 'list'], {
    cwd: VAGRANT_FILE_DIRECTORY
  })
  .then((stdout) => {
    if (stdout.indexOf('vagrant-vbguest (0.12.0)') === -1) {
      console.info('vbguest plugin was already installed')
      return
    }

    console.info('Installing vbguest plugin')
    return run(vagrant, ['plugin', 'install', 'vagrant-vbguest'], {
      cwd: VAGRANT_FILE_DIRECTORY
    })
  })
}

const startVagrant = (vagrant) => {
  return run(vagrant, ['up', '--provider', 'virtualbox'], {
    cwd: VAGRANT_FILE_DIRECTORY
  })
}

const ensureVagrantIsRunning = (vagrant) => {
  return isVagrantRunning(vagrant)
    .then((running) => {
      if (running) {
        console.info('Vagrant was already running')
        return
      }

      console.info('Vagrant was not running')

      return installVbGuestPlugin(vagrant)
      .then(startVagrant.bind(null, vagrant))
      .then(isVagrantRunning.bind(null, vagrant))
      .then((running) => {
        if (!running) {
          throw new Error('Could not start Vagrant!')
        }
      })
  })
}

module.exports = ensureVagrantIsRunning