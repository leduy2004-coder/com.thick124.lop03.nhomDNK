//package com.thick124.lop03.nhomDNK.adapter;
//
//import android.content.Context;
//import android.view.LayoutInflater;
//import android.view.ViewGroup;
//
//import androidx.annotation.NonNull;
//import androidx.recyclerview.widget.RecyclerView;
//
//import com.example.ktcuoiki_dnk.databinding.ItemTestBinding;
//
//import java.util.List;
//
//public class testAdapter extends RecyclerView.Adapter<testAdapter.VoucherViewHolder>{
//
//    private final List<String> items;
//    private Context context;
//
//    public testAdapter(Context context, List<String> items) {
//        this.context = context;
//        this.items = items;
//    }
//
//    @NonNull
//    @Override
//    public VoucherViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
//        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
//        ItemTestBinding binding = ItemTestBinding.inflate(inflater, parent, false);
//        return new VoucherViewHolder(binding);
//    }
//
//    @Override
//    public void onBindViewHolder(@NonNull VoucherViewHolder holder, int position) {
//        String item = items.get(position);
//
//        holder.itemVoucherBinding.tvName.setText(item);
//    }
//
//
//    @Override
//    public int getItemCount() {
//        return items.size();
//    }
//
//    public static class VoucherViewHolder extends RecyclerView.ViewHolder {
//        ItemTestBinding itemVoucherBinding;
//
//        public VoucherViewHolder(@NonNull ItemTestBinding binding) {
//            super(binding.getRoot());
//            this.itemVoucherBinding = binding;
//        }
//    }
//}
