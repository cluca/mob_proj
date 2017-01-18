package cluca.shoplistappa.net;

import android.os.AsyncTask;

import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONObject;

import java.io.IOException;

import cluca.shoplistappa.domain.User;

/**
 * Created by cluca on 17-Jan-17.
 * ShopListAppA
 */

public class LoginReader extends AsyncTask<String, String, User> {
    @Override
    protected User doInBackground(String... strings) {
        User user = null;
        try{
            String username = strings[0];
            String password = strings[1];
            String link = ApiUrl.API+"/auth/session?username="+username+"&password="+password;

            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .method("POST", RequestBody.create(null, new byte[0]))
                    .url(link)
                    .build();


            Response response = null;
            try {
                response = client.newCall(request).execute();
            }catch(IOException e){
                e.printStackTrace();
            }
            String jsonData = null;
            if (response != null) {
                jsonData = response.body().string();
            }
            JSONObject Jobject = new JSONObject(jsonData);
            JSONObject jsonObject = Jobject.getJSONObject("userData");
            user = new User();
            user.setId(jsonObject.getInt("_id"));
            user.setPassword(jsonObject.getString("password"));
            user.setUsername(jsonObject.getString("username"));
            return user;
        } catch (Exception e) {
            return user;
        }
    }
}
