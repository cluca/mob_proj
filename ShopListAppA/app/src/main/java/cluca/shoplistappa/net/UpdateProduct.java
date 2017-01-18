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
 * Created by cluca on 18-Jan-17.
 * ShopListAppA
 */
public class UpdateProduct extends AsyncTask<String, String, Product> {
    @Override
    protected Product doInBackground(String... strings) {
        try {
            int userId = Integer.parseInt(strings[0]);
            int productId = Integer.parseInt(strings[1]);
            String productText = strings[2];
            String link = ApiUrl.API+"/item?userId=" + userId+"&itemId="+productId+"&itemText="+productText;

            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .method("POST", RequestBody.create(null, new byte[0]))
                    .url(link)
                    .build();


            Response response = null;
            try {
                response = client.newCall(request).execute();
            } catch (IOException e) {
                e.printStackTrace();
            }
            String jsonData = null;
            if (response != null) {
                jsonData = response.body().string();
            }
            JSONObject Jobject = new JSONObject(jsonData);
            JSONArray jsonArray = Jobject.getJSONArray("data");
            ArrayList<Product> products = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                Product product = new Product();
                product.setId(jsonObject.getInt("idLista"));
                product.setText(jsonObject.getString("text"));
                products.add(product);
            }
            return products.size() == 1 ? products.get(0) : null;
        } catch (Exception e) {
            Product product = new Product();
            product.setText(e.getMessage());
            return product;
        }
    }
}
