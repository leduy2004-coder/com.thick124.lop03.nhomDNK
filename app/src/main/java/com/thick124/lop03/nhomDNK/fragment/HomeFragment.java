package com.thick124.lop03.nhomDNK.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.ktcuoiki_dnk.activity.MainActivity;
import com.example.ktcuoiki_dnk.databinding.FragmentHomeBinding;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentHomeBinding.inflate(inflater, container, false);

        binding.textHome.setText("home");
        BlankFragment fragment = new BlankFragment();
        binding.btn.setOnClickListener(v -> {
            MainActivity mainActivity = (MainActivity) getActivity();
            assert mainActivity != null;
            Bundle bundle = new Bundle();
            bundle.putString("key", "leduy");
            fragment.setArguments(bundle);
            mainActivity.replaceFragment(fragment);
        });


        return binding.getRoot();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}