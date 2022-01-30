module NotAnalyticsHelper
  def report_hit_javascript_tag
    app_id = ENV.fetch('NOT_ANALYTICS_APP_ID', nil)
    key = ENV.fetch('NOT_ANALYTICS_APP_KEY', nil)
    url = ENV.fetch('NOT_ANALYTICS_URL', nil)

    if app_id.present? && url.present?
      non_bot_payload = NotAnalyticsClient::Hit.new(app_id: app_id, event: nil, key: key).payload
      bot_payload = NotAnalyticsClient::Hit.new(app_id: app_id, event: '[bot traffic]', key: key).payload

      javascript_tag <<~JS
        const debounceCookiePresent = document.cookie.split(';').some(cookie => cookie.trim().startsWith('debounce='))

        if (!debounceCookiePresent && (navigator.onLine === undefined || navigator.onLine)) {
          document.cookie = 'debounce=This cookie prevents the app from registering a page visit more than once per user per day without relying on privacy-infringing fingerprinting techniques.; max-age=86400; SameSite=None; Secure'

          fetch('#{j(url)}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: isBot ? '#{j(bot_payload)}' : '#{j(non_bot_payload)}',
          })
        }
      JS
    end
  end
end
