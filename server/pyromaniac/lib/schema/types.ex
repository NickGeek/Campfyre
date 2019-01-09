defmodule Pyromaniac.Schema.Types do
  use Absinthe.Schema.Notation

  object :post do
    field(:id, :id)
    field(:campfyre_id, :string)
    field(:time, :number)
    field(:score, :number)
    field(:body, :string)
    field(:attachment, :string)
    field(:is_subscribed, :boolean)
  end
end
