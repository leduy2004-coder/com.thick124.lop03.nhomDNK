package com.thick124.lop03.nhomDNK.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.RecyclerView;

import com.thick124.lop03.nhomDNK.activity.MainActivity;
import com.thick124.lop03.nhomDNK.databinding.ItemMemberBinding;
import com.thick124.lop03.nhomDNK.model.MemberModel;

import java.util.List;

public class MemberAdapter  extends RecyclerView.Adapter<MemberAdapter.MemberViewHolder> {

    private List<MemberModel> memberList;
    private Context mContext;
    private OnItemClickListener onItemClickListener;
    private MemberModel memberModel;
//    MovieService apiService;
//    // Interface để lắng nghe sự kiện click item
    public interface OnItemClickListener {
        void onItemClick(MemberModel movie);
    }

    // Phương thức để thiết lập listener từ bên ngoài adapter
    public void setOnItemClickListener(OnItemClickListener listener) {
        this.onItemClickListener = listener;
    }
    public MemberAdapter(Context mContext) {
        this.mContext = mContext;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setData(List<MemberModel> memberList) {
        this.memberList = memberList;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MemberViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate layout for each card
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        ItemMemberBinding binding = ItemMemberBinding.inflate(inflater, parent, false);
        return new MemberViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull MemberViewHolder holder, int position) {
        // Bind data to views
        MemberModel movie = memberList.get(position);
        if (movie == null) {
            return;
        }

        holder.itemMemberBinding.name.setText(movie.getHoTen());
        holder.itemMemberBinding.msv.setText(movie.getMaSinhVien());

//        //Hinh dại dien
//        Picasso.get()
//                .load(movie.getHinhDaiDien()) // URL ảnh cần tải
//                .placeholder(R.drawable.img_phim3) // Ảnh hiển thị khi đang tải (tùy chọn)
//                .error(R.drawable.img_phim3) // Ảnh hiển thị nếu lỗi (tùy chọn)
//                .into(holder.cardMovieHomeBinding.ivImg);
        // Click card
//        holder.itemView.setOnClickListener(v -> {
//            if (mContext instanceof MainActivity) {
//                MainActivity mainActivity = (MainActivity) mContext;
//
//                movieModel.setSelectedMovie(movie);
//                mainActivity.replaceFragment(new MovieFragment() ,true);
//            }
//
//            if (onItemClickListener != null) {
//                onItemClickListener.onItemClick(movie);
//            }
//        });
    }

    @Override
    public int getItemCount() {
        if (memberList != null)
            return memberList.size();
        return 0;
    }

    // ViewHolder class
    public static class MemberViewHolder extends RecyclerView.ViewHolder {
        ItemMemberBinding itemMemberBinding;

        public MemberViewHolder(@NonNull ItemMemberBinding binding) {
            super(binding.getRoot());
            this.itemMemberBinding = binding; // Binding is set here
        }
    }

}