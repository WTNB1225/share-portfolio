require "test_helper"

class RelationshipTest < ActiveSupport::TestCase

  def setup
    @relationship = Relationship.new(follower_id: users(:michael).id, followed_id: users(:archer).id)
  end

  test "relationship should be valid" do
    assert @relationship.valid?
  end

  test "follower_id should be present" do
    @relationship.follower_id = ""
    assert_not @relationship.valid?
  end

  test "followed_id should be present" do
    @relationship.followed_id = ""
    assert_not @relationship.valid?
  end
end
