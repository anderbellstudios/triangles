module NotAnalyticsHelper
  def report_hit_javascript_tag(event: nil)
    app_id = ENV.fetch('NOT_ANALYTICS_APP_ID', nil)
    key = ENV.fetch('NOT_ANALYTICS_APP_KEY', nil)
    url = ENV.fetch('NOT_ANALYTICS_URL', nil)

    if app_id.present? && url.present?
      payload = NotAnalyticsClient::Hit.new(app_id: app_id, event: event, key: key).payload

      javascript_tag <<~JS
        if (navigator.onLine === undefined || navigator.onLine) {
          fetch('#{j(url)}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '#{j(payload)}',
          })
        }
      JS
    end
  end
end
