package com.ahirst.seeker;

import android.app.Application;
import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by adamhirst on 21/01/2018.
 */

public class MSUtil {

    public static final String subscriptionKey = "10a291ef164c4c29926d2e4dede69e46";
    public static final String uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

    public static void getClassificationFromImage(Context c, String s) {

        StringRequest request = new StringRequest(Request.Method.POST,
                uriBase, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/octet-stream");
                headers.put("Ocp-Apim-Subscription-Key", subscriptionKey);
                return headers;
            }
        };


        MainApplication.getInstance().addToRequestQueue(request);
    }

}
