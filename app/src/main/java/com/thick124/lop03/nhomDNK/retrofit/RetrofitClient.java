package com.thick124.lop03.nhomDNK.retrofit;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {

    //    private static final String BASE_URL = "http://192.168.1.6:3000/";
//    private static final String BASE_URL = "https://appmoviednk.onrender.com/";
        private static final String BASE_URL = "http://10.0.2.2:3000/";
    private static Retrofit retrofit;

    public static Retrofit getRetrofitInstance() {
        if (retrofit == null) {

            // Cấu hình OkHttpClient để thiết lập thời gian timeout
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)  // Thời gian chờ kết nối (connect timeout)
                    .readTimeout(30, TimeUnit.SECONDS)     // Thời gian chờ đọc dữ liệu (read timeout)
                    .writeTimeout(30, TimeUnit.SECONDS)    // Thời gian chờ ghi dữ liệu (write timeout)
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

}