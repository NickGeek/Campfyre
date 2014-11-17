package nz.co.nickwebster.campfyre;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.StrictMode;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class StreamAdapter extends ArrayAdapter<String> {
	private final Activity context;
	private final ArrayList<String> list;
	private final ArrayList<String> imageId;
	private final ArrayList<String> commentNums;
	private final ArrayList<String> postTimes;
	private final ArrayList<String> postScores;
    private final ArrayList<String> attachments;
    String imageID;
	
	public StreamAdapter(Activity context, ArrayList<String> list, ArrayList<String> imageId, ArrayList<String> commentNums, ArrayList<String> postTimes, ArrayList<String> postScores, ArrayList<String> attachments) {
		super(context, R.layout.post_list_row_layout, list);
		this.context = context;
		this.list = list;
		this.imageId = imageId;
		this.commentNums = commentNums;
		this.postTimes = postTimes;
		this.postScores = postScores;
        this.attachments = attachments;
	}
	
	@Override
	public View getView(final int position, View view, ViewGroup parent) {
	LayoutInflater inflater = context.getLayoutInflater();
	View rowView = inflater.inflate(R.layout.post_list_row_layout, null, true);
	TextView txtTitle = (TextView) rowView.findViewById(R.id.postDesign);
	final ImageView robofaceView = (ImageView) rowView.findViewById(R.id.imageDesign);
	TextView commentCounter = (TextView) rowView.findViewById(R.id.commentcountTextView);
	TextView postTimeText = (TextView) rowView.findViewById(R.id.postTime);
    Button stokeBtn = (Button)rowView.findViewById(R.id.stokeButton);
	txtTitle.setText(list.get(position));
	commentCounter.setText(commentNums.get(position));
	postTimeText.setText(postTimes.get(position));
	stokeBtn.setText("STOKE (" + postScores.get(position) + ")");

        //Attachments
        final Button attachmentBtn = (Button)rowView.findViewById(R.id.attachmentButton);
        RelativeLayout attachmentLayout = (RelativeLayout)rowView.findViewById(R.id.attachmentLayout);
        final ImageButton attachmentImage = (ImageButton)rowView.findViewById(R.id.attachmentImage);
        if (!attachments.get(position).equals("n/a")) {
            try {
                URL attachmentURL = new URL(attachments.get(position));
                String hostname = attachmentURL.getHost();
                String[] hostnameArr = hostname.split(Pattern.quote("."));
                String domainname = hostnameArr[hostnameArr.length-2];
                if (domainname.equals("imgur")) {
                    attachmentImage.setVisibility(View.VISIBLE);
                    String[] imgURL = attachments.get(position).split(Pattern.quote("/"));
                    String imageFile = imgURL[imgURL.length-1];
                    try {
                        String[] fileArr = imageFile.split(Pattern.quote("."));
                        imageID = fileArr[0];
                    } catch (Exception e) {
                        imageID = imageFile;
                    }

                    //Get and display image from server
                    Runnable getImage = new Runnable() {
                        @Override
                        public void run() {
                            URL url;
                            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                            StrictMode.setThreadPolicy(policy);
                            try {
                                url = new URL("http://i.imgur.com/"+imageID+".png");
                                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                                connection.setDoInput(true);
                                connection.connect();
                                InputStream input = connection.getInputStream();
                                final Bitmap image = BitmapFactory.decodeStream(input);
                                context.runOnUiThread(new Runnable() {
                                    public void run() {
                                        //Set image
                                        attachmentImage.setImageBitmap(image);
                                    }
                                });
                            } catch (Exception e) {
                                Log.e("CampfyreApp", e.toString());
                            }
                        }
                    };

                    Thread getImageThread = new Thread(getImage);
                    getImageThread.start();

                } else {
                    attachmentBtn.setText(attachments.get(position));
                    attachmentLayout.setVisibility(View.VISIBLE);
                }
            }
            catch(Exception e){
                Log.e("CampfyreApp", e.toString());
            }
        }
	
	//Get and display image from server
	Runnable getIP = new Runnable() {
		@Override
		public void run() {
			URL url;
			StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
			StrictMode.setThreadPolicy(policy);
			try {
				url = new URL(imageId.get(position));
				HttpURLConnection connection = (HttpURLConnection) url.openConnection();
				connection.setDoInput(true);
				connection.connect();
				InputStream input = connection.getInputStream();
				final Bitmap profilePicture = BitmapFactory.decodeStream(input);
				context.runOnUiThread(new Runnable() {
                    public void run() {
                        //Set image
                        robofaceView.setImageBitmap(profilePicture);
                    }
                });
			} catch (Exception e) {
			}
		}
	};
	
	Thread getIPThread = new Thread(getIP);
	getIPThread.start();
	
	
	return rowView;
	}
}
