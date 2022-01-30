class FeedbackController < ApplicationController
  def create
    uri = URI(ENV.fetch('SLACK_WEBHOOK_URL'))
    req = Net::HTTP::Post.new(uri)

    req.set_form_data(payload: {
      text: params.require(:body),
    }.to_json)

    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
  end
end
