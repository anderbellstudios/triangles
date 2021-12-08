// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import 'bootstrap'

import Rails from '@rails/ujs'
// import Turbolinks from 'turbolinks'
import * as ActiveStorage from '@rails/activestorage'
import 'channels'
import isbot from 'isbot'

Rails.start()
// Turbolinks.start()
ActiveStorage.start()

window.isBot = isbot(navigator.userAgent)

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      let serviceWorker

      if (registration.installing) {
        serviceWorker = registration.installing
      } else if (registration.waiting) {
        serviceWorker = registration.waiting
      } else if (registration.active) {
        serviceWorker = registration.active
      }
    })
    .catch(console.error)
})

window.addEventListener('DOMContentLoaded', () => {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.classList.add('no-hover')
  }
})
