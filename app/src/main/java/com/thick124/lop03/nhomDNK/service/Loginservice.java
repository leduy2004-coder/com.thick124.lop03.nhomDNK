//package com.thick124.lop03.nhomDNK.service;
//
//import com.example.ktcuoiki_dnk.model.CustomerModel;
//
//import java.util.List;
//import java.util.Map;
//
//import retrofit2.Call;
//import retrofit2.http.Body;
//import retrofit2.http.GET;
//import retrofit2.http.POST;
//import retrofit2.http.Path;
//
//public interface Loginservice {
//    @GET("account")
//    Call<List<CustomerModel>> getAllAccounts();
//
//    @POST("account/login")
//    Call<CustomerModel> loginAccount(@Body CustomerModel customerModel);
//
//    @GET("account/history/{maKH}")
//    Call<List<Map<String, Object>>> getCustomerHistory(@Path("maKH") String maKH);
//}
