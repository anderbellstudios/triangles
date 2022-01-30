import React from 'react'
import { useState, useEffect } from 'react'

const FeedbackForm = props => {
  const [visible, setVisible] = useState(false)
  const [messageBody, setMessageBody] = useState('')
  const [inFlight, setInFlight] = useState(false)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const cookieName = 'feedback_form_seen'
  const { formVersion } = props

  useEffect(() => {
    const cookiePresent = document.cookie.split(';').includes(`${cookieName}=${formVersion}`)
    setVisible(!cookiePresent)
  }, [])

  const setSeen = () => {
    document.cookie = `${cookieName}=${formVersion}; max-age=7884000`
  }

  if (!visible) {
    return <></>
  }

  const messageBodyEmpty = !(/[^\s]/.test(messageBody))

  const submitForm = () => {
    setErrorOccurred(false)
    setInFlight(true)

    fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        body: messageBody,
      }),
    })
      .then(response => {
        if (String(response.status).match(/2\d{2}/)) {
          setSubmitted(true)
          setSeen()
        } else {
          return Promise.reject(response)
        }
      })
      .catch(error => {
        console.error(error)
        setErrorOccurred(true)
      })
      .then(() => setInFlight(false))
  }

  return (
    <div className="feedback-container">
      <div className="alert p-0">
        <div className="card border-0 shadow">
          <div className="card-header d-flex bg-info text-white">
            <strong className="me-auto">{props.title}</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="alert"
              onClick={setSeen}
              aria-label="Close" />
          </div>

          <div className="card-body d-flex flex-column">
            {
              submitted
                ? (
                  <div className="m-auto p-3 text-muted text-center">
                    <h4 className="mb-2">Thanks for your feedback</h4>
                    <button type="button" className="btn btn-link text-muted" data-bs-dismiss="alert">Dismiss</button>
                  </div>
                )
                : (
                  <>
                    <p className="text-muted mb-3">{props.description}</p>

                    <textarea
                      className="form-control mb-3"
                      disabled={inFlight}
                      aria-label="Message text"
                      placeholder="Type a message&hellip;"
                      value={messageBody}
                      onChange={event => {
                        setErrorOccurred(false)
                        setMessageBody(event.target.value)
                      }} />

                    {
                      errorOccurred && (
                        <div className="text-danger mb-3" role="alert">Something went wrong. Please try again.</div>
                      )
                    }

                    <button
                      type="button"
                      className="btn btn-info w-100"
                      disabled={messageBodyEmpty || inFlight}
                      onClick={submitForm}>
                      Submit Feedback
                    </button>
                  </>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
