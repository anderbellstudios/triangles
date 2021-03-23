require 'test_helper'

class GamesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game = games(:one)
  end

  test 'should create game' do
    assert_difference('Game.count') do
      post games_url, params: { game: { id: 'This Is A Game', data: @game.data } }
    end
    
    assert_response :created

    JSON.parse(response.body).then do |response|
      assert_equal Game.order(:created_at).last.id, response['id']
    end
  end

  test 'should show game' do
    get game_url(@game)

    assert_response :success

    JSON.parse(response.body).then do |response|
      assert_equal @game.data, response['data']
    end
  end
end
