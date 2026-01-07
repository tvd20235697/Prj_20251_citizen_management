package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.NhanKhauDTO;
import com.example.householdmanagement.entity.HoKhau;
import com.example.householdmanagement.entity.NhanKhau;
import com.example.householdmanagement.service.NhanKhauService;
import com.example.householdmanagement.service.ThongKeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

@WebMvcTest(NhanKhauController.class)
public class NhanKhauControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NhanKhauService nhanKhauService;

    @MockBean
    private ThongKeService thongKeService;

    @Test
    public void testLayDanhSachNhanKhau() throws Exception {
        HoKhau ho = new HoKhau();
        ho.setSoHoKhau(1L);

        NhanKhau n1 = new NhanKhau();
        n1.setMaNhanKhau(1L);
        n1.setHoKhau(ho);
        n1.setHoTen("Nguyen Van A");
        n1.setGioiTinh("Nam");
        n1.setNgaySinh(LocalDateTime.of(1990,1,1,0,0));
        n1.setCmnd("123456789");

        NhanKhau n2 = new NhanKhau();
        n2.setMaNhanKhau(2L);
        n2.setHoKhau(ho);
        n2.setHoTen("Tran Thi B");
        n2.setGioiTinh("Nu");
        n2.setNgaySinh(LocalDateTime.of(1992,2,2,0,0));
        n2.setCmnd("987654321");

        List<NhanKhau> list = Arrays.asList(n1, n2);
        Mockito.when(nhanKhauService.layTatCaNhanKhau()).thenReturn(list);

        mockMvc.perform(get("/api/nhankhau").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].maNhanKhau", is(1)))
                .andExpect(jsonPath("$[0].hoTen", is("Nguyen Van A")));
    }

    @Test
    public void testLayNhanKhauTheoHoKhauPath() throws Exception {
        HoKhau ho = new HoKhau();
        ho.setSoHoKhau(5L);

        NhanKhau n1 = new NhanKhau();
        n1.setMaNhanKhau(10L);
        n1.setHoKhau(ho);
        n1.setHoTen("A B C");
        n1.setGioiTinh("Nam");
        n1.setNgaySinh(LocalDateTime.of(1980,3,3,0,0));
        n1.setCmnd("111111111");

        List<NhanKhau> list = Arrays.asList(n1);
        Mockito.when(nhanKhauService.layNhanKhauTheoSoHoKhau(5L)).thenReturn(list);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/nhankhau/ho-khau/5").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].maNhanKhau", is(10)))
                .andExpect(jsonPath("$[0].hoTen", is("A B C")));
    }
}
