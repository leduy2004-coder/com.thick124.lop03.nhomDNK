package com.thick124.lop03.nhomDNK.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;

import com.thick124.lop03.nhomDNK.databinding.FragmentBlankBinding;
import com.thick124.lop03.nhomDNK.model.testModel;

import java.util.ArrayList;
import java.util.List;

public class BlankFragment extends Fragment {

    private FragmentBlankBinding binding;
    testAdapter scheduleShowingAdapter;
    private testModel movie;
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        binding = FragmentBlankBinding.inflate(inflater, container, false);

        movie = new ViewModelProvider(requireActivity()).get(testModel.class);
//        movie.getSelectedMovie().observe(getViewLifecycleOwner(), new Observer<MovieModel>() {
//            @Override
//            public void onChanged(MovieModel selectedMovie) {
//                if (selectedMovie != null) {
//
//                } else {
//                    Log.e("MovieFragment", "Nhận được MovieModel null");
//                }
//            }
//        });
        // Khởi tạo movieService
//        movieService = RetrofitClient.getRetrofitInstance().create(MovieService.class);
        List<String> items = new ArrayList<>();

        // Thêm giá trị vào danh sách
        items.add("Item 1");
        items.add("Item 2");
        items.add("Item 3");

        scheduleShowingAdapter = new testAdapter(requireContext(),items);
        GridLayoutManager gridLayoutManager = new GridLayoutManager(requireContext(), 1);

        binding.rcvShowingMovie.setLayoutManager(gridLayoutManager);
        binding.rcvShowingMovie.setAdapter(scheduleShowingAdapter);
        Bundle arguments = getArguments();
        if (arguments != null) {
            String text = arguments.getString("key", "");
            binding.text.setText(text);
        }

        return binding.getRoot();
    }
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}