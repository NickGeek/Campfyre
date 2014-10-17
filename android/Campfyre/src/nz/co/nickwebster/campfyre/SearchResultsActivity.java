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
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.os.StrictMode;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

public class SearchResultsActivity extends Activity {
		ArrayList<String> list;
		ArrayList<String> imageId;
		ArrayList<String> commentNums;
		ArrayList<String> postTimes;
		ArrayList<String> postScores;
		String[] values = {"Loading..."};
		StreamAdapter adapter;
		List<Integer> serverID = new ArrayList<Integer>();
		String tag;
		Runnable updateList;
		Thread updateListThread;
		
		@Override
		protected void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			setContentView(R.layout.search_results);
			Bundle b = getIntent().getExtras();
			tag = b.getString("tag");
			setTitle(tag);
			
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
						url = new URL("http://campfyre.org/api/getpostsV2.php?unused="+randomGenerator.nextInt(100000)+"&size="+size.toString()+"x"+size.toString()+"&search=1&tag="+URLEncoder.encode(tag, "utf-8"));
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
								if (Integer.parseInt(postScore) > 1) {
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
				Intent postDetail = new Intent(SearchResultsActivity.this, postDetial.class);
				Bundle b = new Bundle();
				
				//Workout server ID
				b.putInt("serverID", serverID.get((int) id));
				postDetail.putExtras(b);
				startActivity(postDetail);
				overridePendingTransition(R.anim.right_slide_in, R.anim.right_slide_out);
			  }

			});
		}
		
		@Override
		public void onBackPressed() 
		{
			this.finish();
			overridePendingTransition  (R.anim.right_slide_in, R.anim.right_slide_out);
		}

	}
