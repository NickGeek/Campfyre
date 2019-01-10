module Main exposing (main)

import Browser
import Html exposing (Html, a, article, div, h1, h2, img, p, span, text)
import Html.Attributes exposing (classList, href, id, rel, src, style, target)



{- This is the permalink (single post) page for Campfyre Ignite. -}


main =
    Browser.document
        { init = init
        , view = \model -> { title = getMetaPageTitle model, body = [ view model ] }
        , update = update
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


type alias Post =
    { id : Int
    , campfyreId : String
    , time : Int
    , score : Int
    , content : String
    , attachment : Maybe String
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


getMetaPageTitle : Model -> String
getMetaPageTitle model =
    "Post #" ++ Maybe.withDefault "loading" (Maybe.map String.fromInt model.postId) ++ " | Campfyre Ignite"



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
        [ pageHeader pageTitle True
        , postCard { id = 1, campfyreId = "G6P", time = 123, score = 0, content = "Look how pretty this new post element looks!", attachment = Just "https://i.imgur.com/SzLOUfI.jpg" }
        ]


pageTitle : Html Msg
pageTitle =
    h1 [ classList [ ( "title", True ) ] ]
        [ text "Campfyre\u{200B}"
        , span [ classList [ ( "page-title__subtitle", True ) ] ] [ text "Ignite" ]
        ]


pageHeader : Html Msg -> Bool -> Html Msg
pageHeader content isSubPage =
    div [ classList [ ( "centre", True ) ] ]
        ([ content ]
            ++ (if isSubPage then
                    [ backLink ]

                else
                    []
               )
        )


backLink : Html Msg
backLink =
    h2 [ classList [ ( "back-link", True ) ] ] [ a [ href "https://campfyre.memes.nz" ] [ text "Go to Campfyre" ] ]


postCard : Post -> Html Msg
postCard post =
    article
        [ id ("post" ++ String.fromInt post.id)
        , classList [ ( "post", True ), ( "with-attachment", hasValue post.attachment ) ]
        ]
        [ p []
            [ avatar post.campfyreId
            , text post.content
            ]
        , case post.attachment of
            Just url ->
                attachment url

            Nothing ->
                text ""
        ]


attachment : String -> Html Msg
attachment url =
    a
        [ href url
        , rel "noopener"
        , target "_blank"
        ]
        [ div
            [ style "backgroundImage" ("url(" ++ url ++ ")")
            , classList [ ( "attachment", True ) ]
            ]
            []
        ]


avatar : String -> Html Msg
avatar campfyreId =
    div [ classList [ ( "avatar", True ) ] ]
        [ img [ src ("https://robohash.org/" ++ campfyreId ++ ".png?set=set4&size=64x64") ] []
        , span [] [ text "says" ]
        ]



-- Util


hasValue : Maybe a -> Bool
hasValue option =
    case option of
        Just _ ->
            True

        Nothing ->
            False
