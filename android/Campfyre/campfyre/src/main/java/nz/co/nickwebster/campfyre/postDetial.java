package nz.co.nickwebster.campfyre;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.StrictMode;
import android.text.Editable;
import android.text.Html;
import android.text.InputType;
import android.text.TextWatcher;
import android.text.method.LinkMovementMethod;
import android.text.method.ScrollingMovementMethod;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AbsListView;
import android.widget.AbsListView.OnScrollListener;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.faizmalkani.floatingactionbutton.Fab;

public class postDetial extends Activity {
	
	ArrayList<String> list;
	ArrayList<String> postTimes;
	String[] values = {"Loading comments..."};
	ImageAdapter adapter;
	ArrayList<String> imageId;
	Integer serverID;
	EditText commentTextEdit;
	TextView counter;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.post_details);
		
		Bundle b = getIntent().getExtras();
		serverID = b.getInt("serverID");
		
		//Floating action button - https://github.com/FaizMalkani/FloatingActionButton
		final Fab submitButton = (Fab)findViewById(R.id.submitCommentButton);
		submitButton.setFabColor(getResources().getColor(android.R.color.holo_orange_dark));
		submitButton.setFabDrawable(getResources().getDrawable(R.drawable.ic_action_edit));
		
		//Set listview contents
		final ListView postList = (ListView) findViewById(R.id.commentsListView);
		
		list = new ArrayList<String>();
		imageId = new ArrayList<String>();
		postTimes = new ArrayList<String>();
		for (int i = 0; i < values.length; ++i) {
			list.add(values[i]);
			imageId.add(values[i]);
			postTimes.add(values[i]);
		  }
		
		adapter = new ImageAdapter(this, list, imageId, postTimes);
		postList.setAdapter(adapter);
		
		//TextView postText = (TextView)findViewById(R.id.postTextView);
		//postText.setText(post);
		
		//Request ip
		Runnable getIP = new Runnable() {
			@Override
			public void run() {
				URL url;
				StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
				StrictMode.setThreadPolicy(policy);
				try {
					//Convert 50dp into px for the image
					DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
					Integer size = 60 * (displayData.densityDpi / 160);
					
					url = new URL("http://campfyre.org/api/getip.php?id="+serverID+"&size="+size.toString()+"x"+size.toString());
					InputStream input = url.openStream();
					InputStreamReader is = new InputStreamReader(input);
					StringBuilder sb=new StringBuilder();
					BufferedReader br = new BufferedReader(is);
					String read = br.readLine();
					sb.append(read);
					final String output = sb.toString();
					
					//Update the profile picture
					url = new URL(output);
					HttpURLConnection connection = (HttpURLConnection) url.openConnection();
					connection.setDoInput(true);
					connection.connect();
					InputStream input2 = connection.getInputStream();
					final Bitmap profilePicture = BitmapFactory.decodeStream(input2);
					final ImageView robohash = (ImageView) findViewById(R.id.robohash);
						runOnUiThread(new Runnable() {
							public void run() {
								//Set image
								robohash.setImageBitmap(profilePicture);
							}
						});
				} catch (Exception e) {
					Log.wtf("M3K", e);
				}
			}
		};
		
		Thread getIPThread = new Thread(getIP);
		getIPThread.start();
		
		//Request post
		Runnable getPost = new Runnable() {
			@Override
			public void run() {
				URL url;
				StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
				StrictMode.setThreadPolicy(policy);
				try {
					url = new URL("http://campfyre.org/api/getpost.php?id="+serverID);
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
								TextView postText = (TextView)findViewById(R.id.postTextView);
								postText.setText(Html.fromHtml(output));
								postText.setMovementMethod(new ScrollingMovementMethod());
								postText.setMovementMethod(LinkMovementMethod.getInstance());
							}
						});
				} catch (Exception e) {
					Log.wtf("M3K", e);
				}
			}
		};
		
		Thread getPostThread = new Thread(getPost);
		getPostThread.start();
		
	  //Request time
		Runnable getTime = new Runnable() {
			@Override
			public void run() {
				URL url;
				StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
				StrictMode.setThreadPolicy(policy);
				try {
					url = new URL("http://campfyre.org/api/getTime.php?id="+serverID);
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
								TextView postTimeText = (TextView) findViewById(R.id.postTime2);
								postTimeText.setText(output);
							}
						});
				} catch (Exception e) {
					Log.wtf("M3K", e);
				}
			}
		};
		
		Thread getTimeThread = new Thread(getTime);
		//Timy-wimy threadly-wobbly
		getTimeThread.start();
		
	  //Request Score
		Runnable getScore = new Runnable() {
			@Override
			public void run() {
				URL url;
				StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
				StrictMode.setThreadPolicy(policy);
				try {
					url = new URL("http://campfyre.org/api/getScore.php?id="+serverID);
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
								Button scoreButton = (Button) findViewById(R.id.btnStoke);
								scoreButton.setText(scoreButton.getText().toString()+" ("+output+")");
							}
						});
				} catch (Exception e) {
					Log.wtf("M3K", e);
				}
			}
		};
		
		Thread getScoreThread = new Thread(getScore);
		getScoreThread.start();
		
		//Stoke button
		Button scoreButton = (Button) findViewById(R.id.btnStoke);
		scoreButton.setOnClickListener(
				new OnClickListener() {
					public void onClick(View v) {
						Runnable stoke = new Runnable() {
							@Override
							public void run() {
								URL url;
								StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
								StrictMode.setThreadPolicy(policy);
								try {
									url = new URL("http://campfyre.org/api/stoke.php?mobile=1&type=post&id="+serverID);
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
												Toast.makeText(getApplicationContext(), output, Toast.LENGTH_SHORT).show();
												Intent intent = getIntent();
												intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
												finish();
												overridePendingTransition(0, 0);

												startActivity(intent);
												overridePendingTransition(0, 0);
											}
										});
								} catch (Exception e) {
									Log.wtf("M3K", e);
								}
							}
						};
						
						Thread stokeThread = new Thread(stoke);
						stokeThread.start();
					}
				}
			);
		
	  //Request attachment
		Runnable getAttachment = new Runnable() {
			@Override
			public void run() {
				URL url;
				StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
				StrictMode.setThreadPolicy(policy);
				try {
					url = new URL("http://campfyre.org/api/getAttachment.php?id="+serverID);
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
								Button attachmentButton = (Button) findViewById(R.id.btnViewAttachment);
								if (!output.equals("n/a")) {
									attachmentButton.setVisibility(View.VISIBLE);
									
									//Listen for clicks
									attachmentButton.setOnClickListener(
											new OnClickListener() {
												public void onClick(View v) {
													final Intent intent = new Intent(Intent.ACTION_VIEW).setData(Uri.parse(output));
													postDetial.this.startActivity(intent);
												}
											}
										);
								}
							}
						});
				} catch (Exception e) {
					Log.wtf("M3K", e);
				}
			}
		};
		
		Thread getAttachmentThread = new Thread(getAttachment);
		//Timy-wimy threadly-wobbly
		getAttachmentThread.start();
		
	  //Request Comments
		Runnable updateList = new Runnable() {
			@Override
			public void run() {
				URL url;
				StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
				StrictMode.setThreadPolicy(policy);
				try {
					//Get the comments
					//Convert 50dp into px for the image
					DisplayMetrics displayData = Resources.getSystem().getDisplayMetrics();
					Integer size = 60 * (displayData.densityDpi / 160);
					
					url = new URL("http://campfyre.org/api/getcommentsV2.php?id="+serverID+"&size="+size.toString()+"x"+size.toString());
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
							postTimes.clear();
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
						final String commentTime;
						try{
							content = json_data.getString("comment");
							imageURL = json_data.getString("pic");
							commentTime = json_data.getString("time");
							runOnUiThread(new Runnable() {
								public void run() {
									list.add(content);
									imageId.add(imageURL);
									postTimes.add(commentTime);
									adapter.notifyDataSetChanged();
								}
							});
						} catch (JSONException e) {
							throw new RuntimeException(e);
						}
					}
				} catch (Exception e) {
				}
			}
		};
		
		Thread updateListThread = new Thread(updateList);
		updateListThread.start();
		
	  //Handle clicks
		postList.setOnItemClickListener(new AdapterView.OnItemClickListener() {

			public void onItemClick(AdapterView<?> parent, final View view,
				int position, long id) {
				//final String item = (String) parent.getItemAtPosition(position);
				//Run code
				View setNameView = View.inflate(postDetial.this, R.layout.write_comment, null);
				commentTextEdit = (EditText)setNameView.findViewById(R.id.commentTextEdit);
				counter = (TextView)setNameView.findViewById(R.id.counterTextView);
				
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
					commentTextEdit.addTextChangedListener(txwatcher);
				
				//Back to the dialog!
				AlertDialog.Builder builder = new AlertDialog.Builder(postDetial.this);
				builder.setTitle("Submit comment")
				.setView(setNameView)
				.setCancelable(false)
				.setPositiveButton("Post", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int id) {
						final String input = commentTextEdit.getText().toString();
						//Submit comment
						//do tha biz
						Runnable comment = new Runnable() {
							@Override
							public void run() {
								URL url;
								StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
								StrictMode.setThreadPolicy(policy);
								try {
									url = new URL("http://campfyre.org/api/submit.php?type=comment&id="+serverID+"&postText="+URLEncoder.encode(input, "utf-8"));
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
	
	public void submitComment(View view) {
		View setNameView = View.inflate(postDetial.this, R.layout.write_comment, null);
		commentTextEdit = (EditText)setNameView.findViewById(R.id.commentTextEdit);
		counter = (TextView)setNameView.findViewById(R.id.counterTextView);
		
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
			commentTextEdit.addTextChangedListener(txwatcher);
		
		//Back to the dialog!
		AlertDialog.Builder builder = new AlertDialog.Builder(postDetial.this);
		builder.setTitle("Submit comment")
		.setView(setNameView)
		.setCancelable(false)
		.setPositiveButton("Post", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int id) {
				final String input = commentTextEdit.getText().toString();
				//Submit comment
				//do tha biz
				Runnable comment = new Runnable() {
					@Override
					public void run() {
						URL url;
						StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
						StrictMode.setThreadPolicy(policy);
						try {
							url = new URL("http://campfyre.org/api/submit.php?type=comment&id="+serverID+"&postText="+URLEncoder.encode(input, "utf-8"));
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
		getMenuInflater().inflate(R.menu.post_detail, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_subscribe) {
			//Display a dialog to enter the data
			AlertDialog.Builder builder = new AlertDialog.Builder(this);
			builder.setTitle("Subscribe to comments");

			// Set up the input
			final EditText input = new EditText(this);
			// Specify the type of input expected; this, for example, sets the input as a password, and will mask the text
			input.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
			input.setHint("example@example.com");
			builder.setView(input);

			// Set up the buttons
			builder.setPositiveButton("Subscribe", new DialogInterface.OnClickListener() { 
				@Override
				public void onClick(DialogInterface dialog, int which) {
					//do tha biz
					Runnable subscribe = new Runnable() {
						@Override
						public void run() {
							URL url;
							StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
							StrictMode.setThreadPolicy(policy);
							try {
								url = new URL("http://campfyre.org/api/subscribe.php?id="+serverID+"&email="+input.getText().toString());
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
							} catch (Exception e) {
								Log.wtf("M3K", e);
							}
						}
					};
					
					Thread subscribeThread = new Thread(subscribe);
					subscribeThread.start();
				}
				});
				builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
					dialog.cancel();
					}
				});

				builder.show();
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
		return super.onOptionsItemSelected(item);
	}
	
	@Override
	public void onBackPressed() 
	{
		this.finish();
		overridePendingTransition  (R.anim.right_slide_in, R.anim.right_slide_out);
	}

}
