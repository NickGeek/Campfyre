package nz.co.nickwebster.campfyre;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.os.Bundle;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.text.format.DateUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AbsListView.OnScrollListener;
import android.widget.AdapterView;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.faizmalkani.floatingactionbutton.Fab;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
	ArrayList<String> list;
	ArrayList<String> imageId;
	ArrayList<String> commentNums;
	ArrayList<String> postTimes;
	ArrayList<String> postScores;
	StreamAdapter adapter;
	List<Integer> serverID = new ArrayList<Integer>();
	EditText postTextEdit;
	EditText attachmentTextEdit;
	CheckBox NSFWcheckBox;
	TextView counter;
    Gson gson = new Gson();
    SharedPreferences prefs;
    Menu activityMenu;

    Socket ws;
	String serverURI = "http://192.168.1.54:3973"; // Comment this out
    //String serverURI = "http://campfyre.org:3973"; // Uncomment this
    boolean showNSFW;
    String tag = "";
    int page = 1;

	private void renderPost(Object json) {
        JSONObject postData;
        try {
            //Get and format the post data
            postData = new JSONObject(json.toString());

            serverID.add(0, postData.getInt("id"));
            final String content = postData.getString("post");
            final String commentNum = postData.getString("commentNum");
            final String imageURL = postData.getString("ip");
            final boolean loadBottom = postData.getBoolean("loadBottom");
            final int isNSFW = postData.getInt("nsfw");

            //Time
            long postTimestampMilli = (long)postData.getInt("time")*1000;
            Date now = new Date();
            long currentTime = now.getTime();
            final String relativeTime = DateUtils.getRelativeTimeSpanString(postTimestampMilli, currentTime, 0).toString();

            //Score
            final String postScore;
            if (postData.getInt("score") == 1) {
               postScore = Integer.toString(postData.getInt("score"))+" stokes";
            }
            else {
                postScore = Integer.toString(postData.getInt("score"))+" stokes";
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
                        commentNums.add(0, commentNum);
                        imageId.add(0, imageURL);
                        postTimes.add(0, relativeTime);
                        postScores.add(0, postScore);
                    }
                    else {
                        list.add(content);
                        commentNums.add(commentNum);
                        imageId.add(imageURL);
                        postTimes.add(relativeTime);
                        postScores.add(postScore);
                    }
                    adapter.notifyDataSetChanged();
                }
            });
        }
        catch (Exception e) {
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
            }
            else {
                message = title+": "+body;
            }
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
                }
            });
        }
        catch (Exception e) {
            Log.e("CampfyreApp", e.toString());
        }
    }

    private void refresh() {
        list.clear();
        imageId.clear();
        commentNums.clear();
        postTimes.clear();
        postScores.clear();

        //Convert 50dp into px for the image
        DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
        final Integer size = 60 * (displayData.densityDpi / 160);

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("size", size.toString() + "x" + size.toString());
        params.put("search", tag);
        params.put("startingPost", page * 50 - 50);
        params.put("loadBottom", false);
        ws.emit("get posts", gson.toJson(params));
    }

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

        //Set NSFW
        prefs = getSharedPreferences("CampfyreApp", MODE_PRIVATE);
        showNSFW = prefs.getBoolean("showNSFW", false);
		
		//Floating action button - https://github.com/FaizMalkani/FloatingActionButton
		final Fab submitButton = (Fab)findViewById(R.id.submitButton);
		submitButton.setFabColor(getResources().getColor(android.R.color.holo_orange_dark));
		submitButton.setFabDrawable(getResources().getDrawable(R.drawable.ic_action_edit));
		
		//Set listview contents
		final ListView postList = (ListView) findViewById(R.id.postListView);
		
		list = new ArrayList<String>();
		commentNums = new ArrayList<String>();
		imageId = new ArrayList<String>();
		postTimes = new ArrayList<String>();
		postScores = new ArrayList<String>();
		
		adapter = new StreamAdapter(this, list, imageId, commentNums, postTimes, postScores);
		postList.setAdapter(adapter);

    //API communication
    try {
        ws = IO.socket(serverURI);
    }
    catch (Exception e) {
        Log.e("CampfyreApp", e.toString());
    }

    ws.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            //Convert 50dp into px for the image
            DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
            final Integer size = 60 * (displayData.densityDpi / 160);

            Map<String, Object> params = new HashMap<String, Object>();
            params.put("size", size.toString() + "x" + size.toString());
            params.put("search", tag);
            params.put("startingPost", page * 50 - 50);
            params.put("loadBottom", false);
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
                refresh();
            }
        }
    });

    ws.connect();
		
	
	//Handle clicks
	postList.setOnItemClickListener(new AdapterView.OnItemClickListener() {

		public void onItemClick(AdapterView<?> parent, final View view,
			int position, long id) {
			//final String item = (String) parent.getItemAtPosition(position);

			//Run code
			Intent postDetail = new Intent(MainActivity.this, postDetial.class);
			Bundle b = new Bundle();
            //TODO: WebSockitify
				
			//Workout server ID
			b.putInt("serverID", serverID.get((int) id));
			postDetail.putExtras(b);
			startActivity(postDetail);
			overridePendingTransition(R.anim.right_slide_in, R.anim.right_slide_out);
		}

	});
	
	//Show/hide FAB based on scrolling
	postList.setOnScrollListener(new OnScrollListener() {
			private int mLastFirstVisibleItem;

			@Override
			public void onScrollStateChanged(AbsListView view, int scrollState) {

			}

			@Override
			public void onScroll(AbsListView view, int firstVisibleItem,
				int visibleItemCount, int totalItemCount) {
                //TODO: Load more posts at bottom - http://stackoverflow.com/questions/5123675/find-out-if-listview-is-scrolled-to-the-bottom

				if(mLastFirstVisibleItem < firstVisibleItem) {
					submitButton.hideFab();
				}
				if(mLastFirstVisibleItem > firstVisibleItem) {
					submitButton.showFab();
				}
				mLastFirstVisibleItem = firstVisibleItem;
			}
	});
}

//Handle submit button
public void submitPost(View view) {
	View setNameView = View.inflate(this, R.layout.write_post, null);
	postTextEdit = (EditText)setNameView.findViewById(R.id.postTextEdit);
	attachmentTextEdit = (EditText)setNameView.findViewById(R.id.attachmentTextEdit);
	counter = (TextView)setNameView.findViewById(R.id.counterTextView);
	NSFWcheckBox = (CheckBox)setNameView.findViewById(R.id.NSFWcheckBox);
	
	//Counter
	final TextWatcher txwatcher = new TextWatcher() {
			 public void beforeTextChanged(CharSequence s, int start, int count, int after) {
			 }

			 public void onTextChanged(CharSequence s, int start, int before, int count) {

					counter.setText(String.valueOf(256-s.length()));
			 }

			 public void afterTextChanged(Editable s) {
			 }
		};
		postTextEdit.addTextChangedListener(txwatcher);
	
	//Back to the dialog!
	AlertDialog.Builder builder = new AlertDialog.Builder(this);
	builder.setTitle("Submit post")
	.setView(setNameView)
	.setCancelable(false)
	.setPositiveButton("Post", new DialogInterface.OnClickListener() {
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
	.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
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
        }
        else {
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
            refresh();
		}
        else if (id == R.id.action_showNSFW) {
            if (showNSFW) {
                showNSFW = false;
                SharedPreferences.Editor editor = prefs.edit();
                editor.clear();
                editor.putBoolean("showNSFW", false);
                editor.apply();

                item.setTitle(R.string.action_showNSFW);
            }
            else {
                showNSFW = true;
                SharedPreferences.Editor editor = prefs.edit();
                editor.clear();
                editor.putBoolean("showNSFW", true);
                editor.apply();

                item.setTitle(R.string.action_hideNSFW);
            }
            refresh();
        }
		else if (id == R.id.action_search) {
			//Display a dialog to enter the data
	AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
	builder.setTitle("Search");

	// Set up the input
	final EditText input = new EditText(MainActivity.this);
	// Specify the type of input expected; this, for example, sets the input as a password, and will mask the text
	input.setInputType(InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
	input.setHint(R.string.search_hint);
	builder.setView(input);

	// Set up the buttons
	builder.setPositiveButton("Search", new DialogInterface.OnClickListener() { 
		@Override
		public void onClick(DialogInterface dialog, int which) {
			//TODO: Search
			//Load search activity
			Intent searchResults = new Intent(MainActivity.this, SearchResultsActivity.class);
						Bundle b = new Bundle();
						
						//Workout server ID
						b.putString("tag", input.getText().toString());
						searchResults.putExtras(b);
						startActivity(searchResults);
						overridePendingTransition(R.anim.right_slide_in, R.anim.right_slide_out);
		}
		});
		builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which) {
			dialog.cancel();
			}
		});

		builder.show();
		}
		return super.onOptionsItemSelected(item);
	}
}