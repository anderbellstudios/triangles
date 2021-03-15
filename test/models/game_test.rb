require "test_helper"

class GameTest < ActiveSupport::TestCase
  test 'destroy_stale destroys games updated more than 24 hours ago' do
    game = Game.create(updated_at: 25.hours.ago)
    Game.destroy_stale
    refute Game.exists?(game.id)
  end

  test 'destroy_stale does not destroy games updated less than 24 hours ago' do
    game = Game.create(updated_at: 23.hours.ago)
    Game.destroy_stale
    assert Game.exists?(game.id)
  end
end
