package nz.co.nickwebster.campfyre;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.os.StrictMode;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
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

public class MainActivity extends Activity {
	ArrayList<String> list;
	ArrayList<String> imageId;
	ArrayList<String> commentNums;
	ArrayList<String> postTimes;
	ArrayList<String> postScores;
	String[] values = {"Loading..."};
	StreamAdapter adapter;
	List<Integer> serverID = new ArrayList<Integer>();
	EditText postTextEdit;
	EditText attachmentTextEdit;
	CheckBox NSFWcheckBox;
	TextView counter;
	Runnable updateList;
	Thread updateListThread;

		public static ProgressDialog progress;
	@Override
		protected void onCreate(Bundle savedInstanceState) {
				super.onCreate(savedInstanceState);
				setContentView(R.layout.main);
				
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
				for (int i = 0; i < values.length; ++i) {
						list.add(values[i]);
						commentNums.add(values[i]);
						imageId.add(values[i]);
						postTimes.add(values[i]);
						postScores.add(values[i]);
					}
				
				adapter = new StreamAdapter(this, list, imageId, commentNums, postTimes, postScores);
				postList.setAdapter(adapter);
				
				//Request posts
				updateList = new Runnable() {
					@Override
					public void run() {
						URL url;
								StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
								StrictMode.setThreadPolicy(policy);
						try {
							//Get the posts
							//Convert 50dp into px for the image
							DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
							Integer size = 60 * (displayData.densityDpi / 160);
							
							//Get the posts
							Random randomGenerator = new Random();
							url = new URL("http://campfyre.org/api/getpostsV2.php?unused="+randomGenerator.nextInt(100000)+"&size="+size.toString()+"x"+size.toString());
							InputStream input = url.openStream();
							InputStreamReader is = new InputStreamReader(input);
							StringBuilder sb=new StringBuilder();
							BufferedReader br = new BufferedReader(is);
							String read = br.readLine();
							sb.append(read);
							while ((read = br.readLine()) != null) {
								sb.append(read);
							}
							final String output = sb.toString();
							
							runOnUiThread(new Runnable() {
							public void run() {
								list.clear();
								imageId.clear();
								commentNums.clear();
								postTimes.clear();
								postScores.clear();
							}
						});
							
							//Decode the JSON response
							JSONArray jsonArray;
							try {
											jsonArray = new JSONArray(output);
									} catch (JSONException e) {
											throw new RuntimeException(e);
									}
									for(int i=0; i < jsonArray.length(); i++) {
											JSONObject json_data;
											try {
													json_data = jsonArray.getJSONObject(i);
											} catch (JSONException e) {
													throw new RuntimeException(e);
											}
											final String content;
											final String imageURL;
											final String commentNum;
											final String postTime;
											final String postScore2;
											try{
												serverID.add(json_data.getInt("id"));
													content = json_data.getString("post");
													commentNum = json_data.getString("commentNum");
													imageURL = json_data.getString("pic");
													postTime = json_data.getString("time");
													String postScore = json_data.getString("score");
													if (Integer.parseInt(postScore) > 1 || Integer.parseInt(postScore) == 0) {
														postScore2 = postScore + " stokes";
													}
													else {
														postScore2 = postScore + " stoke";
													}
													runOnUiThread(new Runnable() {
											public void run() {
												list.add(content);
												commentNums.add(commentNum);
												imageId.add(imageURL);
												postTimes.add(postTime);
												postScores.add(postScore2);
												adapter.notifyDataSetChanged();
											}
										});
											} catch (JSONException e) {
													throw new RuntimeException(e);
											}
									}
						} catch (Exception e) {
							Log.wtf("M3K", e);
						}
					}
				};
				
				updateListThread = new Thread(updateList);
				updateListThread.start();
				
			
			//Handle clicks
			postList.setOnItemClickListener(new AdapterView.OnItemClickListener() {

					public void onItemClick(AdapterView<?> parent, final View view,
							int position, long id) {
						//final String item = (String) parent.getItemAtPosition(position);
						
						//Run code
						Intent postDetail = new Intent(MainActivity.this, postDetial.class);
						Bundle b = new Bundle();
						
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

							if(mLastFirstVisibleItem<firstVisibleItem)
							{
								submitButton.hideFab();
							}
							if(mLastFirstVisibleItem>firstVisibleItem)
							{
									submitButton.showFab();
							}
							mLastFirstVisibleItem=firstVisibleItem;

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
						final String attachmentURL;
						if (attachment.equals("")) {
							attachmentURL = "n/a";
						}
						else {
							attachmentURL = attachmentTextEdit.getText().toString();
						}
						//Submit comment
						//do tha biz
					Runnable comment = new Runnable() {
								@Override
								public void run() {
									URL url;
											StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
											StrictMode.setThreadPolicy(policy);
									try {
										if (!NSFWcheckBox.isChecked()) {
											url = new URL("http://campfyre.org/api/submit.php?type=post&postText="+URLEncoder.encode(input, "utf-8")+"&attachment="+URLEncoder.encode(attachmentURL, "utf-8"));
										}
										else {
											url = new URL("http://campfyre.org/api/submit.php?type=post&postText="+URLEncoder.encode(input, "utf-8")+"&attachment="+URLEncoder.encode(attachmentURL, "utf-8")+"&nsfw=1");
										}
										InputStream input = url.openStream();
										InputStreamReader is = new InputStreamReader(input);
										StringBuilder sb=new StringBuilder();
										BufferedReader br = new BufferedReader(is);
										String read = br.readLine();
										sb.append(read);
										final String output = sb.toString();
											runOnUiThread(new Runnable() {
												public void run() {
													Toast.makeText(getApplicationContext(), output, Toast.LENGTH_SHORT).show();
												}
											});
											Intent intent = getIntent();
														intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
														finish();
														overridePendingTransition(0, 0);

														startActivity(intent);
														overridePendingTransition(0, 0);
									} catch (Exception e) {
										Log.wtf("M3K", e);
									}
								}
							};
							
							Thread commentThread = new Thread(comment);
							commentThread.start();
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
				getMenuInflater().inflate(R.menu.main, menu);
		return true;
		}

		@Override
		public boolean onOptionsItemSelected(MenuItem item) {
				// Handle action bar item clicks here. The action bar will
				// automatically handle clicks on the Home/Up button, so long
				// as you specify a parent activity in AndroidManifest.xml.
				int id = item.getItemId();
				if (id == R.id.action_showall) {
					Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://campfyre.org/?show=1"));
					startActivity(browserIntent);
						return true;
				}
				else if (id == R.id.action_refresh) {
					Intent intent = getIntent();
						intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
						finish();
						overridePendingTransition(0, 0);

						startActivity(intent);
						overridePendingTransition(0, 0);
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
			builder.setPositiveButton("Set", new DialogInterface.OnClickListener() { 
				@Override
				public void onClick(DialogInterface dialog, int which) {
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