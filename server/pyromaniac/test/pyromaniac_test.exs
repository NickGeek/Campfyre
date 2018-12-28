defmodule PyromaniacTest do
  use ExUnit.Case
  doctest Pyromaniac

  test "greets the world" do
    assert Pyromaniac.hello() == :world
  end
end
