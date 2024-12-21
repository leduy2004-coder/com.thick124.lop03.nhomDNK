package com.thick124.lop03.nhomDNK.model;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class testModel extends ViewModel {
    private String maPhim;

    private final MutableLiveData<testModel> selectedMovie = new MutableLiveData<>();

    public void setSelectedMovie(testModel movie) {
        selectedMovie.setValue(movie);
    }

    public LiveData<testModel> getSelectedMovie() {
        return selectedMovie;
    }
}
