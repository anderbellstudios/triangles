import React from 'react'
import { useState, useEffect } from 'react'

const PopPixieAdvert = props => {
  const [visible, setVisible] = useState(false)

  const cookieName = 'pop_pixie_advert_seen'
  const { formVersion } = props

  useEffect(() => {
    const cookiePresent = document.cookie.split(';').map(cookie => cookie.trim()).includes(`${cookieName}=${formVersion}`)
    setVisible(!cookiePresent)
  }, [])

  const setSeen = () => {
    document.cookie = `${cookieName}=${formVersion}; max-age=7884000`
  }

  if (!visible) {
    return <></>
  }


  return (
    <div className="feedback-container">
      <div className="alert p-0">
        <div className="card border-0 shadow">
          <div className="card-header d-flex bg-info text-white">
            <strong className="me-auto">We're looking for playtesters</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="alert"
              onClick={setSeen}
              aria-label="Close" />
          </div>

          <div className="card-body d-flex flex-column">
            <p>Interested in video games? 🎮</p>
            <p>
              We're looking for playtesters to try out our latest game,{' '}
              <strong>Pop Pixie: Mission Training</strong>.
            </p>
            <p className="mb-0">
              <a
                href="https://anderbell.studio/playtesting/"
                target="_blank"
                rel="noopener"
                className="btn btn-info"
              >
                I want to playtest a video game
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopPixieAdvert
