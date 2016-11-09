package cluca.shoplist.model;

/**
 * Created by cluca on 09-Nov-16.
 * ShopListAppA
 */

public class User {
    private Integer id;
    private String username;
    private String password;
    private String firstname;
    private String lastname;

    public User() {
        username = null;
        password = null;
        firstname = null;
        lastname = null;
        id = null;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
}
