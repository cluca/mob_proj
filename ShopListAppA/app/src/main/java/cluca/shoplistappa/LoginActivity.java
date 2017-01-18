package cluca.shoplistappa;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
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
                    showAlert("Invalid username and/or password");
                }
            }
        });
        context = getApplicationContext();
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);

        LocationListener locationListener = new LocationListener() {

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }

            @Override
            public void onLocationChanged(Location location) {
                double latitude = location.getLatitude();
                double longitude = location.getLongitude();
                String cityName;
                Geocoder gcd = new Geocoder(getBaseContext(), Locale.getDefault());
                try {
                    List<Address> addresses = gcd.getFromLocation(latitude,longitude, 1);
                    if (addresses.size() > 0) {
                        System.out.println(addresses.get(0).getLocality());
                        cityName = addresses.get(0).getLocality();
                        String s = latitude + " Current City is: " + cityName;
                        showAlert(s);
                    }
                }
                catch (IOException e) {
                    e.printStackTrace();
                }

            }
        };

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1, 0, locationListener);
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
