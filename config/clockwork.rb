require './config/boot'
require './config/environment'

module Clockwork
  handler do |job|
    case job
    when 'Game.destroy_stale'
      Game.destroy_stale
    end
  end

  every(1.hour, 'Game.destroy_stale', at: '**:00')
end
