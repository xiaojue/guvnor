var View = require('ampersand-view')
var notify = require('../../helpers/notification')
var $ = require('jquery')

module.exports = View.extend({
  template: require('./stop.hbs'),
  bindings: {
    'model.isStopping': [{
      type: 'booleanClass',
      no: 'fa-stop',
      selector: '[data-hook=stopbutton] i'
    }, {
      type: 'booleanClass',
      name: 'fa-circle-o-notch',
      selector: '[data-hook=stopbutton] i'
    }, {
      type: 'booleanClass',
      name: 'fa-spin',
      selector: '[data-hook=stopbutton] i'
    }, {
      type: 'booleanAttribute',
      name: 'disabled',
      selector: '[data-hook=stopbutton]'
    }]
  },
  events: {
    'click [data-hook=stopbutton]': 'stopProcess'
  },
  stopProcess: function (event) {
    event.target.blur()

    this.model.isStopping = true

    $.ajax({
      url: this.model.collection.parent.url + '/processes/' + this.model.name,
      type: 'PATCH',
      data: {
        status: 'stop'
      },
      success: function () {
        this.model.isStopping = false

        notify({
          header: 'Process stopped',
          message: ['%s on %s stopped', this.model.name, this.model.collection.parent.name],
          type: 'success'
        })
      }.bind(this),
      error: function (error) {
        this.model.isStopping = false

        notify({
          header: 'Stop error',
          message: ['%s on %s has failed to stop - %s', this.model.name, this.model.collection.parent.name, error.message || error.code],
          type: 'danger'
        })
      }.bind(this)
    })
  }
})