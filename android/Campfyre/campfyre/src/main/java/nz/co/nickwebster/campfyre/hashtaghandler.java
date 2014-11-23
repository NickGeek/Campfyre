package nz.co.nickwebster.campfyre;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

public class hashtaghandler extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Get hashtag from url
        Uri uri = getIntent().getData();
        String hashtag = uri.toString().split("/")[3];

        //Send hashtag to the MainActivity to search
        Intent intent = new Intent(hashtaghandler.this, MainActivity.class);
        intent.putExtra("tag", hashtag);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }
}
