defmodule Pyromaniac.Schema.Post do
  use Absinth.Schema
  import_types(Pyromaniac.Schema.Types)

  @mock_posts %{
    "1" => %{
      id: "1",
      campfyre_id: "abc123hash",
      time: 1_545_802_665,
      score: 2,
      body: "First!",
      is_subscribed: false
    }
  }

  query do
    @desc "Get post"
    field :post, :post do
      arg(:id, non_null(:id))

      resolve(fn %{id: item_id}, _ ->
        {:ok, @mock_posts[item_id]}
      end)
    end
  end
end
