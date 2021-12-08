module NotAnalyticsHelper
  def report_hit_javascript_tag
    app_id = ENV.fetch('NOT_ANALYTICS_APP_ID', nil)
    key = ENV.fetch('NOT_ANALYTICS_APP_KEY', nil)
    url = ENV.fetch('NOT_ANALYTICS_URL', nil)

    if app_id.present? && url.present?
      non_bot_payload = NotAnalyticsClient::Hit.new(app_id: app_id, event: nil, key: key).payload
      bot_payload = NotAnalyticsClient::Hit.new(app_id: app_id, event: '[bot traffic]', key: key).payload

      javascript_tag <<~JS
        if (navigator.onLine === undefined || navigator.onLine) {
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
