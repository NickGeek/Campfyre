module Main exposing (main)

import Browser
import Html exposing (Html, a, article, button, div, h1, h2, header, img, p, span, text)
import Html.Attributes exposing (classList, href, id, rel, src, style, target)
import Http exposing (get)
import Json.Decode as Decode exposing (Decoder, int, string)
import Json.Decode.Pipeline exposing (required)
import Svgs exposing (stokeSvg)
import Time exposing (millisToPosix, now)



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
    , postId : Int
    , post : Maybe (Result Http.Error Post)
    }


type alias JSModel =
    { campfyreId : Maybe String
    , postId : Int
    }


type alias Post =
    { id : Int
    , campfyreId : String
    , time : Time.Posix
    , score : Int
    , commentCount : Int
    , content : String
    , attachment : Maybe String
    }


init : JSModel -> ( Model, Cmd Msg )
init modelFromJs =
    let
        model =
            convertJsModel modelFromJs

        initCmd : Model -> Cmd Msg
        initCmd m =
            get { url = "http://localhost:3973/tmp-api/post/" ++ String.fromInt m.postId, expect = Http.expectJson GotPostJson postDecoder }

        initPage : Model -> Cmd Msg -> ( Model, Cmd Msg )
        initPage m cmd =
            ( m, cmd )
    in
    initPage model (initCmd model)


convertJsModel : JSModel -> Model
convertJsModel jsModel =
    { campfyreId = Maybe.withDefault "G6P" jsModel.campfyreId
    , postId = jsModel.postId
    , post = Nothing
    }


getMetaPageTitle : Model -> String
getMetaPageTitle model =
    "Post #" ++ String.fromInt model.postId ++ " | Campfyre Ignite"


type alias ApiPost =
    { id : Int
    , commentNum : String
    , hash_id : String
    , time : Int
    , score : Int
    , nsfw : Int
    , attachment : String
    , post : String
    }


postDecoder : Decoder ApiPost
postDecoder =
    Decode.succeed ApiPost
        |> required "id" int
        |> required "commentNum" string
        |> required "hash_id" string
        |> required "time" int
        |> required "score" int
        |> required "nsfw" int
        |> required "attachment" string
        |> required "post" string


toPost : ApiPost -> Post
toPost apiPost =
    { id = apiPost.id
    , campfyreId = apiPost.hash_id
    , time = millisToPosix apiPost.time
    , score = apiPost.score
    , commentCount = apiPost.commentNum |> String.left 1 |> String.toInt |> Maybe.withDefault 0
    , content = apiPost.post
    , attachment =
        if apiPost.attachment /= "n/a" then
            Just apiPost.attachment

        else
            Nothing
    }



-- Update


type Msg
    = UpdateCampfyreId String
    | GotPostJson (Result Http.Error ApiPost)


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case msg of
        UpdateCampfyreId newId ->
            ( { model | campfyreId = newId }, Cmd.none )

        GotPostJson res ->
            case res of
                Ok p ->
                    ( { model | post = Just <| (Ok <| (p |> toPost)) }, Cmd.none )

                Err e ->
                    ( { model | post = Just (Err e) }, Cmd.none )



-- View


view : Model -> Html Msg
view model =
    div [ classList [ ( "centre", True ) ] ]
        [ pageHeader pageTitle model.campfyreId True
        , case
            model.post
          of
            Just postResult ->
                case postResult of
                    Ok post ->
                        postCard post

                    Err _ ->
                        postCard
                            (toPost
                                { id = 123
                                , hash_id = "1234"
                                , time = 1572691392389
                                , score = 2
                                , commentNum = "3 comments"
                                , nsfw = 0
                                , post = "Test"
                                , attachment = "https://images.unsplash.com/photo-1572606848633-e5cbf647b121?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1277&q=80"
                                }
                            )

            Nothing ->
                loadingIndicator
        ]


pageTitle : Html Msg
pageTitle =
    h1 [ classList [ ( "title", True ) ] ]
        [ text "Campfyre\u{200B}"
        , span [ classList [ ( "page-title__subtitle", True ) ] ] [ text "Ignite" ]
        ]


pageHeader : Html Msg -> String -> Bool -> Html Msg
pageHeader content campfyreId isSubPage =
    header [ classList [ ( "centre", True ) ] ]
        ([ content ]
            ++ (if isSubPage then
                    [ backLink ]

                else
                    []
               )
            ++ [ postingAs campfyreId ]
        )


postingAs : String -> Html Msg
postingAs campfyreId =
    h2 [ classList [ ( "page-header__posting-as", True ) ] ]
        [ text "Posting as "
        , avatar campfyreId False
        , a [ href "#!" ] [ text " (change)" ]
        ]


backLink : Html Msg
backLink =
    h2 [ classList [ ( "back-link", True ) ] ] [ a [ href "https://campfyre.memes.nz" ] [ text "Go to Campfyre" ] ]


postCard : Post -> Html Msg
postCard post =
    let
        attachmentClass : ( String, Bool )
        attachmentClass =
            case post.attachment of
                Just _ ->
                    ( "with-attachment", True )

                Nothing ->
                    ( "only-text", True )
    in
    article
        [ id ("post" ++ String.fromInt post.id)
        , classList [ ( "post", True ), attachmentClass ]
        ]
        [ div [ classList [ ( "post__body", True ) ] ]
            [ avatar post.campfyreId True
            , p [] [ text post.content ]
            , postCardFooter post.id post.score 0
            ]
        , case post.attachment of
            Just url ->
                attachment url

            Nothing ->
                text ""
        ]


postCardFooter : Int -> Int -> Int -> Html Msg
postCardFooter id score commentCount =
    div [ classList [ ( "post__footer", True ) ] ]
        [ button []
            [ stokeSvg "stoke-icon"
            , text ("Stoke (" ++ String.fromInt score ++ ")")
            ]
        , a [ href ("https://campfyre.memes.nz/permalink.html?id=" ++ String.fromInt id) ] [ text ("Comments (" ++ String.fromInt commentCount ++ ")") ]
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


avatar : String -> Bool -> Html Msg
avatar campfyreId isQuoting =
    div [ classList [ ( "avatar", True ) ] ]
        [ img
            [ src
                ("https://robohash.org/"
                    ++ campfyreId
                    ++ ".png?set=set4&size="
                    ++ (if isQuoting then
                            "64x64"

                        else
                            "42x42"
                       )
                )
            ]
            []
        , if isQuoting then
            span [] [ text "says…" ]

          else
            text ""
        , if campfyreId == "admin" then
            span [ classList [ ( "poster-label", True ) ] ] [ text "[admin]" ]

          else
            text ""
        ]


loadingIndicator : Html Msg
loadingIndicator =
    p []
        [ text "Loading..." ]
