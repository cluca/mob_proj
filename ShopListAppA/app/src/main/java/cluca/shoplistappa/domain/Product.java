package cluca.shoplistappa.domain;

/**
 * Created by cluca on 17-Jan-17.
 * ShopListAppA
 */
public class Product {
    private int id;
    private String text;

    public Product() {
    }

    @Override
    public String toString() {
        return text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
