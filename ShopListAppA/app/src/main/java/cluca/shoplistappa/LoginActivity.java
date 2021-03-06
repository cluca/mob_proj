package cluca.shoplistappa;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.concurrent.ExecutionException;

import cluca.shoplistappa.domain.User;
import cluca.shoplistappa.net.LoginReader;

/**
 * Created by cluca on 17-Jan-17.
 * ShopListAppA
 */

public class LoginActivity extends AppCompatActivity {

    private EditText username, password;
    private Button loginBtn;
    private TextView errors;
    private Context context;
    private ImageView image;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_layout);

        username = (EditText) findViewById(R.id.username);
        password = (EditText) findViewById(R.id.password);

        loginBtn = (Button) findViewById(R.id.loginBtn);

        errors = (TextView) findViewById(R.id.errors);

        username.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                checkCredentials();
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                User user = null;
                try {
                    user = new LoginReader().execute(username.getText().toString(), password.getText().toString()).get();
                } catch (InterruptedException e) {
                    System.out.println("InterruptExecution on login with stack" + e.getMessage());
                } catch (ExecutionException e) {
                    System.out.println("Execution exception on login with stack" + e.getMessage());
                }
                if (user != null) {
                    Intent intent = new Intent(getApplicationContext(), ListProducts.class);
                    intent.putExtra("id", user.getId());
                    intent.putExtra("username", user.getUsername());
                    intent.putExtra("password", user.getPassword());
                    startActivity(intent);
                } else {
                    Vibrator vibrator = (Vibrator) getApplicationContext().getSystemService(Context.VIBRATOR_SERVICE);
                    vibrator.vibrate(1000);
                    showAlert("Invalid username and/or password");
                }
            }
        });
        image = (ImageView)findViewById(R.id.imageView);
        Animation animation = AnimationUtils.loadAnimation(getApplicationContext(),
                R.anim.clockwise);
        image.startAnimation(animation);
    }

    private void checkCredentials() {
        if (!username.getText().toString().matches("")){
            loginBtn.setEnabled(true);
        } else {
            loginBtn.setEnabled(false);
        }

    }

    private void showAlert(String str_mesg){
        errors.setText(str_mesg);
    }
}
