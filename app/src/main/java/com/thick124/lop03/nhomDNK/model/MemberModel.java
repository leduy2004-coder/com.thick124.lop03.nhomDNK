package com.thick124.lop03.nhomDNK.model;

public class MemberModel {
    private String maSinhVien;
    private String hoTen;
    private String hinhAnhSinhVien;

    public MemberModel(String maSinhVien, String hoTen, String hinhAnhSinhVien) {
        this.maSinhVien = maSinhVien;
        this.hoTen = hoTen;
        this.hinhAnhSinhVien = hinhAnhSinhVien;
    }

    public MemberModel() {
    }

    public String getMaSinhVien() {
        return maSinhVien;
    }

    public void setMaSinhVien(String maSinhVien) {
        this.maSinhVien = maSinhVien;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getHinhAnhSinhVien() {
        return hinhAnhSinhVien;
    }

    public void setHinhAnhSinhVien(String hinhAnhSinhVien) {
        this.hinhAnhSinhVien = hinhAnhSinhVien;
    }
}
