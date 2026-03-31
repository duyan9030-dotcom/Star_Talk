package com.startalk.startalk.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.startalk.startalk.admin.entity.Admin;
import com.startalk.startalk.admin.mapper.AdminMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/test")
public class AdminTestController {

    private final AdminMapper adminMapper;

    public AdminTestController(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    @GetMapping("/encode")
    public Map<String, String> encode(@RequestParam String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        Map<String, String> result = new HashMap<>();
        result.put("password", password);
        result.put("hash", hash);
        result.put("matches", String.valueOf(encoder.matches(password, hash)));
        return result;
    }

    @GetMapping("/admin-info")
    public Map<String, Object> getAdminInfo(@RequestParam String username) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, username);
        Admin admin = adminMapper.selectOne(wrapper);

        Map<String, Object> result = new HashMap<>();
        if (admin == null) {
            result.put("found", false);
            result.put("message", "Admin not found");
        } else {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean matches = encoder.matches("admin123", admin.getPassword());
            result.put("found", true);
            result.put("id", admin.getId());
            result.put("username", admin.getUsername());
            result.put("passwordHash", admin.getPassword());
            result.put("status", admin.getStatus());
            result.put("passwordAdmin123Matches", matches);
        }
        return result;
    }

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        return "INSERT INTO sys_admin (username, password, nickname, status) VALUES ('" + username + "', '" + hash + "', '" + username + "', 1);";
    }
}
