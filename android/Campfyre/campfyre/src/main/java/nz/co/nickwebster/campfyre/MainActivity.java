package nz.co.nickwebster.campfyre;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.text.format.DateUtils;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AbsListView.OnScrollListener;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ExpandableListView;
import android.widget.TextView;
import android.widget.Toast;

import com.faizmalkani.floatingactionbutton.Fab;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class MainActivity extends Activity {
    ArrayList<String> list;
    ArrayList<String> imageId;
    ArrayList<String> commentNums;
    ArrayList<String> postTimes;
    ArrayList<String> postScores;
    ArrayList<String> attachments;
    StreamAdapter adapter;
    ArrayList<Integer> serverID;
    EditText postTextEdit;
    EditText attachmentTextEdit;
    CheckBox NSFWcheckBox;
    TextView counter;
    Gson gson = new Gson();
    SharedPreferences prefs;
    Menu activityMenu;
    int oldLast;
    public static Map<Integer, Integer> idComparison = new HashMap<Integer, Integer>();
    Map<Integer, List<Map<String, Object>>> commentData = new HashMap<Integer, List<Map<String, Object>>>();
    ExpandableListView postList;
    String intentType;
    String action;


    Socket ws;
//    String serverURI = "http://192.168.1.54:3973"; // Comment this out
    String serverURI = "http://campfyre.org:3973"; // Uncomment this
    boolean showNSFW;
    String tag = "";
    int page = 1;

    private void cleanUp(Boolean keepPagination) {
        //Clean out Maps/Lists/Vars
        list.clear();
        imageId.clear();
        commentNums.clear();
        postTimes.clear();
        postScores.clear();
        attachments.clear();
        commentData.clear();
        idComparison.clear();
        serverID.clear();
        oldLast = 0;
        if (!keepPagination) page = 1;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                adapter.notifyDataSetChanged();
            }
        });
    }

    private void refresh(Boolean keepPagination) {
        for (int i = 0; i < list.size(); i++) {
            postList.collapseGroup(i);
        }
        cleanUp(keepPagination);

        //Convert 50dp into px for the image
        DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
        final Integer size = 50 * (displayData.densityDpi / 160);

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("size", size.toString() + "x" + size.toString());
        params.put("search", tag);
        params.put("startingPost", page * 50 - 50);
        params.put("loadBottom", true);
        params.put("reverse", true);
        ws.emit("get posts", gson.toJson(params));
    }

    private void renderPost(Object json) {
        JSONObject postData;
        try {
            //Get and format the post data
            postData = new JSONObject(json.toString());

            final Integer postid = postData.getInt("id");
            final String content = postData.getString("post");
            final String commentNum = postData.getString("commentNum");
            final String imageURL = postData.getString("ip");
            final boolean loadBottom = postData.getBoolean("loadBottom");
            final int isNSFW = postData.getInt("nsfw");
            final String postScore = postData.getString("score");
            final String attachment = postData.getString("attachment");
            final JSONArray commentArr = postData.getJSONArray("comments");

            //Time
            long postTimestampMilli = (long) postData.getInt("time") * 1000;
            Date now = new Date();
            long currentTime = now.getTime();
            final String relativeTime = DateUtils.getRelativeTimeSpanString(postTimestampMilli, currentTime, 0).toString();

            //Comment data
            final List<Map<String, Object>> commentTotal = new ArrayList<Map<String, Object>>();
            for (int i = 0; i < commentArr.length(); i++) {
                JSONObject commentObj = commentArr.getJSONObject(i);
                Map<String, Object> comment = new HashMap<String, Object>();
                comment.put("comment", commentObj.getString("comment"));
                comment.put("imageURL", commentObj.getString("ip"));

                //Time
                postTimestampMilli = (long) commentObj.getInt("time") * 1000;
                now = new Date();
                currentTime = now.getTime();
                comment.put("time", DateUtils.getRelativeTimeSpanString(postTimestampMilli, currentTime, 0).toString());

                //Put in the map
                commentTotal.add(comment);
            }
            if (commentArr.length() == 0) {
                Map<String, Object> comment = new HashMap<String, Object>();
                comment.put("comment", "");
                commentTotal.add(comment);
            }

            //Add the post to the list
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (isNSFW == 1 && !showNSFW) {
                        return;
                    }

                    if (!loadBottom) {
                        list.add(0, content);
                        serverID.add(0, postid);
                        commentNums.add(0, commentNum);
                        imageId.add(0, imageURL);
                        postTimes.add(0, relativeTime);
                        postScores.add(0, postScore);
                        attachments.add(0, attachment);
                        commentData.put(postid, commentTotal);
                    } else {
                        list.add(content);
                        serverID.add(postid);
                        commentNums.add(commentNum);
                        imageId.add(imageURL);
                        postTimes.add(relativeTime);
                        postScores.add(postScore);
                        attachments.add(attachment);
                        commentData.put(postid, commentTotal);
                    }
                    adapter.notifyDataSetChanged();
                }
            });
        } catch (Exception e) {
            Log.e("CampfyreApp", e.toString());
        }
    }

    private void displayMessage(Object json) {
        try {
            JSONObject data = new JSONObject(json.toString());
            String title = data.getString("title");
            String body = data.getString("body");
            final String message;
            if (body.equals("")) {
                message = title;
            } else {
                message = title + ": " + body;
            }
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
                }
            });
        } catch (Exception e) {
            Log.e("CampfyreApp", e.toString());
        }
    }

    private void updateStokes(Object json) {
        try {
            JSONObject data = new JSONObject(json.toString());
            String newScore = data.getString("score");
            int idOnServer = data.getInt("id");
            int positionInList = idComparison.get(idOnServer);
            postScores.set(positionInList, newScore);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    adapter.notifyDataSetChanged();
                }
            });
        } catch (Exception e) {
            Log.e("CampfyreApp", e.toString());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        //Set NSFW
        prefs = getSharedPreferences("CampfyreApp", MODE_PRIVATE);
        showNSFW = prefs.getBoolean("showNSFW", false);

        //Intent from sharing to Campfyre
        try {
            Intent intent = getIntent();
            String action = intent.getAction();
            String intentType = intent.getType();

            if (action.equals(Intent.ACTION_SEND)) {
                View setNameView = View.inflate(this, R.layout.write_post, null);
                postTextEdit = (EditText) setNameView.findViewById(R.id.postTextEdit);
                attachmentTextEdit = (EditText) setNameView.findViewById(R.id.attachmentTextEdit);
                counter = (TextView) setNameView.findViewById(R.id.counterTextView);
                NSFWcheckBox = (CheckBox) setNameView.findViewById(R.id.NSFWcheckBox);

                if (intentType.startsWith("text/")) {
                    postTextEdit.setText(intent.getStringExtra(Intent.EXTRA_TEXT));
                    counter.setText(String.valueOf(256 - intent.getStringExtra(Intent.EXTRA_TEXT).length()));
                }

                //Counter
                final TextWatcher txwatcher = new TextWatcher() {
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                        counter.setText(String.valueOf(256 - s.length()));
                    }

                    public void onTextChanged(CharSequence s, int start, int before, int count) {
                        counter.setText(String.valueOf(256 - s.length()));
                    }

                    public void afterTextChanged(Editable s) {
                    }
                };
                postTextEdit.addTextChangedListener(txwatcher);

                //Back to the dialog!
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle(getResources().getString(R.string.action_post))
                        .setView(setNameView)
                        .setCancelable(false)
                        .setPositiveButton(getResources().getString(R.string.action_post), new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                final String input = postTextEdit.getText().toString();
                                final String attachment = attachmentTextEdit.getText().toString();
                                final Object nsfw;
                                if (NSFWcheckBox.isChecked()) {
                                    nsfw = 1;
                                } else {
                                    nsfw = "";
                                }

                                Map<String, Object> params = new HashMap<String, Object>();
                                params.put("post", input);
                                params.put("attachment", attachment);
                                params.put("nsfw", nsfw);
                                params.put("catcher", "");
                                ws.emit("submit post", gson.toJson(params));
                            }
                        })
                        .setNegativeButton(getResources().getString(R.string.action_cancel), new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                dialog.cancel();
                            }
                        }).show();

                if (intentType.startsWith("image/")) {
                    attachmentTextEdit.setText("Uploading, please wait...");
                    Uri attachedImageUri = (Uri)intent.getParcelableExtra(Intent.EXTRA_STREAM);
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    Bitmap attachedImageBM = MediaStore.Images.Media.getBitmap(this.getContentResolver(), attachedImageUri);
                    attachedImageBM.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
                    final byte[] byteArray = byteArrayOutputStream .toByteArray();
                    try {
                        Runnable thread = new Runnable() {
                            @Override
                            public void run() {
                                //Convert image into base64 and upload to imgur
                                String b64img = Base64.encodeToString(byteArray, Base64.DEFAULT);
                                HttpClient httpClient = new DefaultHttpClient();
                                HttpPost httpPost = new HttpPost("https://api.imgur.com/3/upload.json");
                                List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
                                nameValuePairs.add(new BasicNameValuePair("image", b64img));
                                try {
                                    httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
                                    httpPost.setHeader("Authorization", "Client-ID 16d7fa3d6041992");

                                    HttpResponse response = httpClient.execute(httpPost);
                                    String responseStr = EntityUtils.toString(response.getEntity());
                                    JSONObject jsonObject = new JSONObject(responseStr);
                                    JSONObject data = jsonObject.getJSONObject("data");
                                    final String imgurLink = data.getString("link");
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            attachmentTextEdit.setText(imgurLink);
                                        }
                                    });
                                }
                                catch (Exception e) {
                                    Log.e("CampfyreApp", e.toString());
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            attachmentTextEdit.setText("Image failed to upload :-(");
                                        }
                                    });
                                }
                            }
                        };
                        Thread uploadT = new Thread(thread);
                        uploadT.start();
                    } catch (Exception e) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                attachmentTextEdit.setText("Image failed to upload :-(");
                            }
                        });
                    }
                }
            }
        }
        catch (Exception e) {
            Log.e("CampfyreApp", e.toString());
        }

        //Floating action button - https://github.com/FaizMalkani/FloatingActionButton
        final Fab submitButton = (Fab) findViewById(R.id.submitButton);
        submitButton.setFabColor(getResources().getColor(R.color.campfyre_orange));
        submitButton.setFabDrawable(getResources().getDrawable(R.drawable.ic_action_edit));

        //Set listview contents
        postList = (ExpandableListView) findViewById(R.id.postExpListView);
        postList.setChoiceMode(ExpandableListView.CHOICE_MODE_SINGLE);

        list = new ArrayList<String>();
        commentNums = new ArrayList<String>();
        imageId = new ArrayList<String>();
        postTimes = new ArrayList<String>();
        postScores = new ArrayList<String>();
        attachments = new ArrayList<String>();
        serverID = new ArrayList<Integer>();

        adapter = new StreamAdapter(this, list, imageId, commentNums, postTimes, postScores, attachments, serverID, commentData);
        postList.setAdapter(adapter);

        //API communication
        try {
            ws = IO.socket(serverURI);
        } catch (Exception e) {
            Log.e("CampfyreApp", e.toString());
        }

        ws.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                //Convert 50dp into px for the image
                DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
                final Integer size = 50 * (displayData.densityDpi / 160);
                cleanUp(false);

                page = 1;
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("size", size.toString() + "x" + size.toString());
                params.put("search", tag);
                params.put("startingPost", page * 50 - 50);
                params.put("loadBottom", true);
                params.put("reverse", true);
                ws.emit("get posts", gson.toJson(params));
            }
        }).on("new post", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                renderPost(args[0]);
            }
        }).on("success message", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                displayMessage(args[0]);
            }
        }).on("error message", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                displayMessage(args[0]);
            }
        }).on("show nsfw", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                if (!showNSFW) {
                    showNSFW = true;
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.clear();
                    editor.putBoolean("showNSFW", true);
                    editor.apply();

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MenuItem nsfwButton = activityMenu.findItem(R.id.action_showNSFW);
                            nsfwButton.setTitle(R.string.action_hideNSFW);
                        }
                    });
                    refresh(false);
                }
            }
        }).on("post stoked", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                updateStokes(args[0]);
            }
        }).on("new comment", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                //Comment data
                try {
                    JSONObject commentObj = new JSONObject(args[0].toString());
                    Map<String, Object> comment = new HashMap<String, Object>();
                    comment.put("comment", commentObj.getString("comment"));
                    comment.put("imageURL", commentObj.getString("ip"));

                    int positionInList = idComparison.get(commentObj.getInt("parent"));

                    //Time
                    long postTimestampMilli = (long) commentObj.getInt("time") * 1000;
                    Date now = new Date();
                    long currentTime = now.getTime();
                    comment.put("time", DateUtils.getRelativeTimeSpanString(postTimestampMilli, currentTime, 0).toString());

                    //Add to the counter
                    String commentCounter = commentNums.get(positionInList);
                    String firstChar = commentCounter.split(Pattern.quote(" "))[0];
                    Integer oldCommNum = Integer.parseInt(firstChar);
                    oldCommNum++;
                    String newCommStr;

                    if (oldCommNum == 1) {
                        newCommStr = oldCommNum+" comment";
                        List<Map<String, Object>> currentComment = commentData.get(commentObj.getInt("parent"));
                        if (currentComment.get(0).get("comment").equals("")) {
                            commentData.remove(commentObj.getInt("parent"));
                        }
                    }
                    else {
                        newCommStr = oldCommNum+" comments";
                    }

                    List<Map<String, Object>> commentsForPost = new ArrayList<Map<String, Object>>();
                    try {
                        if (commentData.get(commentObj.getInt("parent")) != null) {
                            commentsForPost = commentData.get(commentObj.getInt("parent"));
                            commentsForPost.add(comment);
                        }
                        else {
                            commentsForPost.add(comment);
                        }
                    }
                    catch (Exception e) {
                        commentsForPost.add(comment);
                    }

                    commentData.put(commentObj.getInt("parent"), commentsForPost);
                    commentNums.set(positionInList, newCommStr);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            adapter.notifyDataSetChanged();
                        }
                    });
                }
                catch (Exception e) {
                    Log.e("CampfyreApp", e.toString());
                }
            }
        });

        //Show/hide FAB based on scrolling
        postList.setOnScrollListener(new OnScrollListener() {
            private int mLastFirstVisibleItem;

            public void onScrollStateChanged(AbsListView view, int scrollState) {
                if (view.getId() == postList.getId()) {
                    final int currentFirstVisibleItem = postList.getFirstVisiblePosition();

                    if (currentFirstVisibleItem > mLastFirstVisibleItem) {
                        submitButton.hideFab();
                    } else if (currentFirstVisibleItem < mLastFirstVisibleItem) {
                        submitButton.showFab();
                    }

                    mLastFirstVisibleItem = currentFirstVisibleItem;
                }
            }

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
                int lastItem = firstVisibleItem + visibleItemCount;
                if (lastItem == totalItemCount && lastItem != oldLast && totalItemCount > 5) {
                    oldLast = lastItem;
                    page++;

                    //Convert 50dp into px for the image
                    DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
                    final Integer size = 50 * (displayData.densityDpi / 160);

                    Map<String, Object> params = new HashMap<String, Object>();
                    params.put("size", size.toString() + "x" + size.toString());
                    params.put("search", tag);
                    params.put("startingPost", page * 50 - 50);
                    params.put("loadBottom", true);
                    params.put("reverse", true);
                    ws.emit("get posts", gson.toJson(params));
                } else if (firstVisibleItem == 0) {
                    submitButton.showFab();
                }
            }
        });
    }

    //Handle back button
    @Override
    public void onBackPressed() {
        if (tag.equals("")) {
            super.onBackPressed();
        } else {
            tag = "";
            setTitle(R.string.app_name);
            ws.disconnect();
            cleanUp(false);
            ws.connect();
        }
    }

    //Reconnection
    @Override
    public void onResume() {
        super.onResume();
        try {
            if (!getIntent().getStringExtra("tag").isEmpty()) {
                tag = getIntent().getStringExtra("tag");
                page = 1;
                setTitle(tag);
                oldLast = 0;
                for (int i = 0; i < list.size(); i++) {
                    postList.collapseGroup(i);
                }
                refresh(false);
            }
            else {
                ws.disconnect();
                cleanUp(false);
                ws.connect();
            }
        }
        catch (Exception e) {
            tag = "";
            ws.disconnect();
            cleanUp(false);
            ws.connect();
        }
    }

    //Handle submit button
    public void submitPost(View view) {
        View setNameView = View.inflate(this, R.layout.write_post, null);
        postTextEdit = (EditText) setNameView.findViewById(R.id.postTextEdit);
        attachmentTextEdit = (EditText) setNameView.findViewById(R.id.attachmentTextEdit);
        counter = (TextView) setNameView.findViewById(R.id.counterTextView);
        NSFWcheckBox = (CheckBox) setNameView.findViewById(R.id.NSFWcheckBox);

        //Counter
        final TextWatcher txwatcher = new TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                counter.setText(String.valueOf(256 - s.length()));
            }

            public void afterTextChanged(Editable s) {
            }
        };
        postTextEdit.addTextChangedListener(txwatcher);

        //Back to the dialog!
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getResources().getString(R.string.action_post))
                .setView(setNameView)
                .setCancelable(false)
                .setPositiveButton(getResources().getString(R.string.action_post), new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        final String input = postTextEdit.getText().toString();
                        final String attachment = attachmentTextEdit.getText().toString();
                        final Object nsfw;
                        if (NSFWcheckBox.isChecked()) {
                            nsfw = 1;
                        } else {
                            nsfw = "";
                        }

                        Map<String, Object> params = new HashMap<String, Object>();
                        params.put("post", input);
                        params.put("attachment", attachment);
                        params.put("nsfw", nsfw);
                        params.put("catcher", "");
                        ws.emit("submit post", gson.toJson(params));
                    }
                })
                .setNegativeButton(getResources().getString(R.string.action_cancel), new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.cancel();
                    }
                }).show();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        activityMenu = menu;
        getMenuInflater().inflate(R.menu.main, menu);

        //NSFW button
        MenuItem nsfwButton = menu.findItem(R.id.action_showNSFW);
        if (showNSFW) {
            nsfwButton.setTitle(R.string.action_hideNSFW);
        } else {
            nsfwButton.setTitle(R.string.action_showNSFW);
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_refresh) {
            ws.disconnect();
            cleanUp(false);
            ws.connect();
        } else if (id == R.id.action_showNSFW) {
            if (showNSFW) {
                showNSFW = false;
                SharedPreferences.Editor editor = prefs.edit();
                editor.clear();
                editor.putBoolean("showNSFW", false);
                editor.apply();

                item.setTitle(R.string.action_showNSFW);
            } else {
                showNSFW = true;
                SharedPreferences.Editor editor = prefs.edit();
                editor.clear();
                editor.putBoolean("showNSFW", true);
                editor.apply();

                item.setTitle(R.string.action_hideNSFW);
            }
            refresh(false);
        } else if (id == R.id.action_search) {
            //Display a dialog to enter the data
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setTitle(getResources().getString(R.string.action_search));

            // Set up the input
            final EditText input = new EditText(MainActivity.this);
            // Specify the type of input expected; this, for example, sets the input as a password, and will mask the text
            input.setInputType(InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
            input.setHint(R.string.search_hint);
            builder.setView(input);

            // Set up the buttons
            builder.setPositiveButton(getResources().getString(R.string.action_search), new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    //Search
                    page = 1;
                    tag = input.getText().toString();
                    setTitle(tag);
                    oldLast = 0;
                    refresh(false);
                }
            });
            builder.setNegativeButton(getResources().getString(R.string.action_cancel), new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    dialog.cancel();
                }
            });

            builder.show();
        } else if (id == R.id.action_showCredits) {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle(getResources().getString(R.string.action_showCredits))
                    .setView(View.inflate(this, R.layout.about, null))
                    .setCancelable(false)
                    .setPositiveButton(getResources().getString(R.string.action_close), new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.cancel();
                        }
                    }).show();
        }
        return super.onOptionsItemSelected(item);
    }
}