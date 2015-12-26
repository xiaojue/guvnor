
module.exports = Object.freeze({
  PLIST_LOCATIONS: process.env.GUVNOR_PLIST_LOCATIONS || '/Library/LaunchDaemons/',
  LAUNCHCTL_PATH: process.env.GUVNOR_LAUNCHCTL_PATH || '/bin/launchctl',
  NEWSYSLOGD_PATH: process.env.NEWSYSLOGD_PATH || '/etc/newsyslog.d'
})