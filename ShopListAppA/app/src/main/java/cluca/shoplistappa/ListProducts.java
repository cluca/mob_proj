package cluca.shoplistappa;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import cluca.shoplistappa.domain.Product;
import cluca.shoplistappa.net.DeleteProduct;
import cluca.shoplistappa.net.ProductsReader;
import cluca.shoplistappa.net.UpdateProduct;

/**
 * Created by cluca on 17-Jan-17.
 * ShopListAppA
 */
public class ListProducts extends AppCompatActivity {
    private ListView productList;
    private Button addButton;
    private Button deleteButton;
    private Button updateButton;
    private EditText editText;
    private Product selectedProduct;
    private Intent intent;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.itemlist_layout);

        intent = getIntent();

        productList = (ListView) findViewById(R.id.productList);
        addButton = (Button) findViewById(R.id.addBtn);
        deleteButton = (Button) findViewById(R.id.deleteBtn);
        updateButton = (Button) findViewById(R.id.updateBtn);
        editText = (EditText) findViewById(R.id.show);


        List<Product> array = new ArrayList<>();
        try {
            int id = intent.getIntExtra("id", 0);
            array = new ProductsReader().execute(id).get();
        }catch(InterruptedException e){
            System.out.println("InterruptExecution on login with stack"+ e.getMessage());
        }catch(ExecutionException e){
            System.out.println("Execution exception on login with stack"+ e.getMessage());
        }
        final ArrayAdapter<Product> adapter = new ArrayAdapter<>(this,
                android.R.layout.simple_list_item_1, array);

        productList.setAdapter(adapter);
        productList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                ArrayAdapter<Product> arrayAdapter = (ArrayAdapter<Product>) adapterView.getAdapter();
                selectedProduct = arrayAdapter.getItem(i);
                if (selectedProduct != null) {
                    enableButtons();
                }
            }
        });

        deleteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (selectedProduct != null){
                    Boolean deleted = null;
                    try {
                        deleted = new DeleteProduct().execute(intent.getIntExtra("id", 0), selectedProduct.getId()).get();
                    }catch(InterruptedException e){
                        System.out.println("InterruptExecution on login with stack"+ e.getMessage());
                    }catch(ExecutionException e){
                        System.out.println("Execution exception on login with stack"+ e.getMessage());
                    }
                    if (deleted != null && deleted == Boolean.TRUE) {
                        showAlert("Produs sters!");
                        adapter.remove(selectedProduct);
                        selectedProduct = null;
                        disableButtons();
                    } else {
                        showAlert("Produsul nu a fost sters!");
                        selectedProduct = null;
                        disableButtons();
                    }
                } else {
                    showAlert("Niciun produs selectat!");
                }
            }
        });
        updateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Product product = null;
                try {
                    product = new UpdateProduct().execute(String.valueOf(intent.getIntExtra("id", 0)), String.valueOf(selectedProduct.getId()), editText.getText().toString()).get();
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void showAlert(String s) {
        editText.setText(s);
    }

    private void disableButtons(){
        deleteButton.setEnabled(false);
        updateButton.setEnabled(false);
    }

    private void enableButtons(){
        deleteButton.setEnabled(true);
        updateButton.setEnabled(true);
    }
}
