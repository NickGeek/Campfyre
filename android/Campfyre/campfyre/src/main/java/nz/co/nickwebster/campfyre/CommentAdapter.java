package nz.co.nickwebster.campfyre;

import android.app.Activity;
import android.widget.ArrayAdapter;

import java.util.Map;

public class CommentAdapter extends ArrayAdapter<String> {
    private final Activity context;
    private final Map<String, Object> commentData;

    public CommentAdapter(Activity context, Map<String, Object> commentData) {
        super(context, R.layout.post_list_row_layout);
        this.context = context;
        this.commentData = commentData;
    }
}
