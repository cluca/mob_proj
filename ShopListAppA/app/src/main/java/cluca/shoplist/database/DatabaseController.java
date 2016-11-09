package cluca.shoplist.database;

import android.os.StrictMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import cluca.shoplist.model.User;
import cz.msebera.android.httpclient.client.HttpClient;
import cz.msebera.android.httpclient.client.methods.HttpPost;
import cz.msebera.android.httpclient.impl.client.BasicResponseHandler;
import cz.msebera.android.httpclient.impl.client.DefaultHttpClient;

/**
 * Created by cluca on 09-Nov-16.
 * ShopListAppA
 */

public class DatabaseController {
    private StrictMode.ThreadPolicy threadPolicy;
    private HttpClient httpClient;
    private final String url = "http://172.0.0.1";
    public DatabaseController() {
        threadPolicy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(threadPolicy);
        httpClient = new DefaultHttpClient();
    }

    public User login_user(final String username){
        String uri = "/login";
        HttpPost request = new HttpPost(url + uri + "?username="+username);
        BasicResponseHandler basicResponseHandler = new BasicResponseHandler();
        String result = "";

        try {
            result = httpClient.execute(request, basicResponseHandler);
            JSONObject jsonObject = new JSONObject(result);
            JSONArray jsonArray = jsonObject.getJSONArray("user");
            if (jsonArray.isNull(0)){
                return null;
            }
            User user = new User();
            user.setId(jsonArray.getJSONObject(0).getInt("id"));
            user.setUsername(jsonArray.getJSONObject(0).getString("username"));
            user.setPassword(jsonArray.getJSONObject(0).getString("password"));
            user.setFirstname(jsonArray.getJSONObject(0).getString("firstname"));
            user.setLastname(jsonArray.getJSONObject(0).getString("lastname"));
            return user;
        } catch (IOException e) {
            return null;
        } catch (JSONException e) {
            return null;
        }
    }
}
