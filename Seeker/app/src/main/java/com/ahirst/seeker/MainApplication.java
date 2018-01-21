package com.ahirst.seeker;

import android.app.Application;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

/**
 * Created by adamhirst on 21/01/2018.
 */

public class MainApplication extends Application {

    private static MainApplication sInstance = new MainApplication();
    private RequestQueue rQueue = Volley.newRequestQueue(getApplicationContext());

    @Override
    public void onCreate() {
        super.onCreate();
        // Setup singleton instance
        sInstance = this;
    }

    // Getter to access Singleton instance
    public static MainApplication getInstance() {
        return sInstance ;
    }

    public void addToRequestQueue(Request request) {
        rQueue.add(request);
    }

}
