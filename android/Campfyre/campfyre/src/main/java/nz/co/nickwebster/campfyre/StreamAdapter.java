package nz.co.nickwebster.campfyre;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.StrictMode;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseExpandableListAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;

public class StreamAdapter extends BaseExpandableListAdapter {
    private final Activity context;
    private final ArrayList<String> list;
    private final ArrayList<String> imageId;
    private final ArrayList<String> commentNums;
    private final ArrayList<String> postTimes;
    private final ArrayList<String> postScores;
    private final ArrayList<String> attachments;
    private final ArrayList<Integer> serverID;
    private final Map<Integer, List<Map<String, Object>>> commentData;
    String imageID;
    Socket ws;
    //    	String serverURI = "http://192.168.1.54:3973"; // Comment this out
    String serverURI = "http://campfyre.org:3973"; // Uncomment this
    Integer id;

    public StreamAdapter(Activity context, ArrayList<String> list, ArrayList<String> imageId, ArrayList<String> commentNums, ArrayList<String> postTimes, ArrayList<String> postScores, ArrayList<String> attachments, ArrayList<Integer> serverID, Map<Integer, List<Map<String, Object>>> commentData) {
        this.context = context;
        this.list = list;
        this.imageId = imageId;
        this.commentNums = commentNums;
        this.postTimes = postTimes;
        this.postScores = postScores;
        this.attachments = attachments;
        this.serverID = serverID;
        this.commentData = commentData;
    }

    @Override
    public View getGroupView(final int position, boolean isExpanded, View view, ViewGroup parent) {
        id = serverID.get(position);
        LayoutInflater inflater = context.getLayoutInflater();
        View rowView = inflater.inflate(R.layout.post_list_row_layout, null, true);
        TextView txtTitle = (TextView) rowView.findViewById(R.id.postDesign);
        final ImageView robofaceView = (ImageView) rowView.findViewById(R.id.imageDesign);
        final ImageButton attachmentImage = (ImageButton) rowView.findViewById(R.id.attachmentImage);
        final Button attachmentBtn = (Button) rowView.findViewById(R.id.attachmentButton);
        final Button shareBtn = (Button) rowView.findViewById(R.id.shareButton);
        TextView commentCounter = (TextView) rowView.findViewById(R.id.commentcountTextView);
        TextView postTimeText = (TextView) rowView.findViewById(R.id.postTime);
        Button stokeBtn = (Button) rowView.findViewById(R.id.stokeButton);
        txtTitle.setText(list.get(position));
        commentCounter.setText(commentNums.get(position));
        postTimeText.setText(postTimes.get(position));
        stokeBtn.setText("STOKE (" + postScores.get(position) + ")");
        MainActivity mainActivity = new MainActivity();
        mainActivity.idComparison.put(serverID.get(position), position);

        //Attachments
        RelativeLayout attachmentLayout = (RelativeLayout) rowView.findViewById(R.id.attachmentLayout);
        final View contentSeperator = rowView.findViewById(R.id.contentSeperator);
        if (!attachments.get(position).equals("n/a")) {
            try {
                URL attachmentURL = new URL(attachments.get(position));
                String hostname = attachmentURL.getHost();
                String[] hostnameArr = hostname.split(Pattern.quote("."));
                String domainname = hostnameArr[hostnameArr.length - 2];
                if (domainname.equals("imgur")) {
                    attachmentImage.setVisibility(View.VISIBLE);
                    contentSeperator.setVisibility(View.GONE);
                    String[] imgURL = attachments.get(position).split(Pattern.quote("/"));
                    String imageFile = imgURL[imgURL.length - 1];
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
                                url = new URL("http://i.imgur.com/" + imageID + "l.png");
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
            } catch (Exception e) {
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
                    Log.e("CampfyreApp", e.toString());
                }
            }
        };

        Thread getIPThread = new Thread(getIP);
        getIPThread.start();

        //Listeners for buttons on row
        stokeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Gson gson = new Gson();
                try {
                    ws = IO.socket(serverURI);
                } catch (Exception e) {
                    Log.e("CampfyreApp", e.toString());
                }
                ws.connect();
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("id", serverID.get(position));
                ws.emit("stoke", gson.toJson(params));
            }
        });

        attachmentImage.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(attachments.get(position)));
                context.startActivity(intent);
            }
        });

        attachmentBtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(attachments.get(position)));
                context.startActivity(intent);
            }
        });

        shareBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("text/plain");
                intent.putExtra(Intent.EXTRA_SUBJECT, list.get(position));
                intent.putExtra(Intent.EXTRA_TEXT, "http://campfyre.org/permalink.html?id=" + serverID.get(position));
                context.startActivity(intent);
            }
        });

        return rowView;
    }

    public View getChildView(int groupPosition, final int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        View commentHolderView = inflater.inflate(R.layout.list_row_layout, null, true);

        TextView commentText = (TextView) commentHolderView.findViewById(R.id.postDesignC);
        final ImageView robofaceView = (ImageView) commentHolderView.findViewById(R.id.imageDesignC);
        TextView postTimeText = (TextView) commentHolderView.findViewById(R.id.postTimeC);
        final List<Map<String, Object>> comments = commentData.get(serverID.get(groupPosition));
        if (!comments.get(childPosition).get("comment").toString().equals("")) {
            commentText.setText(comments.get(childPosition).get("comment").toString());
            postTimeText.setText(comments.get(childPosition).get("time").toString());

            //Get and display image from server
            Runnable getIP = new Runnable() {
                @Override
                public void run() {
                    URL url;
                    StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                    StrictMode.setThreadPolicy(policy);
                    try {
                        url = new URL(comments.get(childPosition).get("imageURL").toString());
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
                        Log.e("CampfyreApp", e.toString());
                    }
                }
            };

            Thread getIPThread = new Thread(getIP);
            getIPThread.start();
        }

        return commentHolderView;
    }

    public boolean isChildSelectable(int groupPosition, int ChildPosition) {
        return false;
    }

    public int getGroupCount() {
        return list.size();
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    public Object getChild(int groupPosition, int childPosition) {
        return true;
    }

    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    public Object getGroup(int groupPosition) {
        return true;
    }

    public int getChildrenCount(int groupPosition) {
        List<Map<String, Object>> comments = commentData.get(serverID.get(groupPosition));
        Map<String, Object> firstComment = comments.get(0);
        try {
            Object commentText = firstComment.get("comment");
            if (commentText != null) {
                if (!commentText.toString().equals("")) {
                    return comments.size();
                } else {
                    return 0;
                }
            }
        } catch (Exception e) {
            return 0;
        }
        return 0;
    }
}
