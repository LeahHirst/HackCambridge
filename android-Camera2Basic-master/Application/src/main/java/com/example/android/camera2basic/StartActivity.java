package com.example.android.camera2basic;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class StartActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        final Button button2 = (Button)findViewById(R.id.button3);

        final Button otherbutton = (Button)findViewById(R.id.button2);

        button2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //if (null == savedInstanceState) {
                    getSupportFragmentManager().beginTransaction()
                            .replace(R.id.container, Camera2BasicFragment.newInstance())
                            .commit();
               // }
            }
        });



        otherbutton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setType("image/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);//
                startActivityForResult(Intent.createChooser(intent, "Select Picture"),1);
            }
        });
    }
}
