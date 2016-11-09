package cluca.shoplist.model;

/**
 * Created by cluca on 09-Nov-16.
 * ShopListAppA
 */

public class Product {
    private Integer id;
    private String name;

    public Product(String name) {
        this.name = name;
        id = -1;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
