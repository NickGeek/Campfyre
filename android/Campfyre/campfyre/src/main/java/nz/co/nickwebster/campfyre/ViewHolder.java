package nz.co.nickwebster.campfyre;

import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.android.volley.toolbox.NetworkImageView;

public class ViewHolder extends RecyclerView.ViewHolder {
    public static NetworkImageView roboface;
    public static TextView postText;
    public static TextView commentCounter;
    public static TextView time;
    public static NetworkImageView attachmentImg;
    public static Button stoke;
    public static Button attachmentBtn;

    public ViewHolder(View itemView) {
        super(itemView);
        roboface = (NetworkImageView)itemView.findViewById(R.id.postRoboface);
        postText = (TextView)itemView.findViewById(R.id.postText);
        commentCounter = (TextView)itemView.findViewById(R.id.commentcountTextView);
        time = (TextView)itemView.findViewById(R.id.postRelTime);
        attachmentImg = (NetworkImageView)itemView.findViewById(R.id.postAttachment);
        stoke = (Button)itemView.findViewById(R.id.stokeButton);
        attachmentBtn = (Button)itemView.findViewById(R.id.attachmentButton);
    }
}
