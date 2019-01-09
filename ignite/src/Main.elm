module Main exposing (main)

import Browser
import Html exposing (Html, a, div, h1, h2, span, text)
import Html.Attributes exposing (classList, href)



{- This is the permalink (single post) page for Campfyre Ignite. -}


main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }



-- Model


type alias Model =
    { campfyreId : String
    , postId : Maybe Int
    }


type alias JSModel =
    { campfyreId : Maybe String
    , postId : Int
    }


defaultModel : Model
defaultModel =
    { campfyreId = "test_id", postId = Nothing }


init : Maybe JSModel -> ( Model, Cmd Msg )
init modelFromJs =
    ( Maybe.withDefault defaultModel (Maybe.map convertJsModel modelFromJs), Cmd.none )


convertJsModel : JSModel -> Model
convertJsModel jsModel =
    { campfyreId = Maybe.withDefault "test_id" jsModel.campfyreId
    , postId = Just jsModel.postId
    }



-- Update


type Msg
    = UpdateCampfyreId String


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case msg of
        UpdateCampfyreId newId ->
            ( { model | campfyreId = newId }, Cmd.none )



-- View


view : Model -> Html Msg
view model =
    div [ classList [ ( "centre", True ) ] ]
        [ pageTitle
        , h2 [ classList [ ( "back-link", True ) ] ] [ a [ href "https://campfyre.memes.nz" ] [ text "Go to Campfyre" ] ]
        ]


pageTitle : Html Msg
pageTitle =
    h1 [ classList [ ( "title", True ) ] ]
        [ text "Campfyre\u{200B}"
        , span [ classList [ ( "page-title__subtitle", True ) ] ] [ text "Ignite" ]
        ]
