package cluca.shoplistappa.net;

import android.os.AsyncTask;

import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
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
public class ProductsReader extends AsyncTask<Integer, String, ArrayList<Product>> {
    @Override
    protected ArrayList<Product> doInBackground(Integer... ints) {
        ArrayList<Product> products;
        try{
            int userId = ints[0];
            String link = "http://192.168.0.101:3000/api/shoplist?id="+userId;

            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
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
            products = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++){
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                Product product = new Product();
                product.setId(jsonObject.getInt("idLista"));
                product.setText(jsonObject.getString("text"));
                products.add(product);
            }
            return products;
        } catch (Exception e) {
            return null;
        }
    }
}
