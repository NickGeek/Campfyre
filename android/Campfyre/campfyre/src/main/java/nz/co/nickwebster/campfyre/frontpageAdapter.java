package nz.co.nickwebster.campfyre;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class frontpageAdapter extends RecyclerView.Adapter<frontpageAdapter.ViewHolder> {
    private List<Post> posts;
    private int rowLayout;
    private Context mContext;

    public frontpageAdapter(List<Post> posts, int rowLayout, Context context) {
        this.posts = posts;
        this.rowLayout = rowLayout;
        this.mContext = context;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View v = LayoutInflater.from(viewGroup.getContext()).inflate(rowLayout, viewGroup, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int i) {
        Post post = posts.get(i);
        //viewHolder.roboface.setImageUrl(post.ip);
        viewHolder.postText.setText(post.content);
        viewHolder.commentCounter.setText(post.commentNum);
        viewHolder.time.setText(post.relativeTime);
        if (!post.attachment.equals("n/a")) {
            String shortURL = post.attachment.substring(0, 11)+"...";
            viewHolder.attachmentBtn.setText(shortURL);
            viewHolder.attachmentBtn.setVisibility(View.VISIBLE);

            //Image
            URL attachmentURL = new URL(post.attachment);
            String hostname = attachmentURL.getHost();
            if (hostname.matches("(imgur.com|sharepic.tk)")) {
                switch (hostname) {
                    case "imgur.com":
                        List<String> imgURL = new ArrayList<String>(Arrays.asList(hostname.split("/")));
                        String imageFile = imgURL.get(imgURL.size()-1);
                        String imageID;
                        try {
                            List<String> fileArr = new ArrayList<String>(Arrays.asList(imageFile.split(".")));
                            imageID = fileArr.get(0);
                        }
                        catch (Exception e) {
                            imageID = imageFile;
                        }
                        //viewHolder.attachmentImg.setImageUrl("http://i.imgur.com/"+imageID+".png");
                }
            }
        }
    }
}
