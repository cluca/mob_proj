package cluca.shoplistappa.net;

import android.os.AsyncTask;

import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import cluca.shoplistappa.domain.Product;

/**
 * Created by cluca on 17-Jan-17.
 * ShopListAppA
 */
public class DeleteProduct extends AsyncTask<Integer, String, Boolean> {
    @Override
    protected Boolean doInBackground(Integer... integers) {
        Boolean deleted = null;
        try{
            int userId = integers[0];
            int itemId = integers[1];
            String link = "http://192.168.0.101:3000/api/deleteItem?userId="+userId+"&itemId="+itemId;

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
            JSONArray jsonArray = Jobject.getJSONArray("data");
            ArrayList<Product> products = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++){
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                Product product = new Product();
                product.setId(jsonObject.getInt("idLista"));
                product.setText(jsonObject.getString("text"));
                products.add(product);
            }
            deleted = products.size() == 1?Boolean.TRUE:Boolean.FALSE;
            return deleted;
        } catch (Exception e) {
            return null;
        }
    }
}
