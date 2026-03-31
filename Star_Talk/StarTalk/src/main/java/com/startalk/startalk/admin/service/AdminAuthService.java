package com.startalk.startalk.admin.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.startalk.startalk.admin.entity.Admin;
import com.startalk.startalk.admin.mapper.AdminMapper;
import com.startalk.startalk.admin.vo.AdminInfoVO;
import com.startalk.startalk.admin.vo.AdminLoginRequest;
import com.startalk.startalk.admin.vo.AdminLoginResponse;
import com.startalk.startalk.admin.vo.ChangePasswordRequest;
import com.startalk.startalk.exception.BusinessException;
import com.startalk.startalk.utils.JwtUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService extends ServiceImpl<AdminMapper, Admin> {

    private final JwtUtil jwtUtil;

    public AdminAuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public AdminLoginResponse login(AdminLoginRequest request) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, request.getUsername())
               .eq(Admin::getStatus, 1);
        Admin admin = this.getOne(wrapper);

        if (admin == null) {
            throw new BusinessException(401, "管理员不存在或已禁用");
        }

        if (!BCrypt.checkpw(request.getPassword(), admin.getPassword())) {
            throw new BusinessException(401, "密码错误");
        }

        String token = jwtUtil.generateToken(admin.getId(), "ADMIN");

        AdminLoginResponse response = new AdminLoginResponse();
        response.setToken(token);
        response.setAdminId(admin.getId());
        response.setUsername(admin.getUsername());
        response.setNickname(admin.getNickname());
        response.setAvatar(admin.getAvatar());
        return response;
    }

    public AdminInfoVO getInfo(Long adminId) {
        Admin admin = this.getById(adminId);
        if (admin == null) {
            throw new BusinessException(404, "管理员不存在");
        }

        AdminInfoVO vo = new AdminInfoVO();
        vo.setId(admin.getId());
        vo.setUsername(admin.getUsername());
        vo.setNickname(admin.getNickname());
        vo.setAvatar(admin.getAvatar());
        vo.setPhone(admin.getPhone());
        vo.setEmail(admin.getEmail());
        return vo;
    }

    public void changePassword(Long adminId, ChangePasswordRequest request) {
        Admin admin = this.getById(adminId);
        if (admin == null) {
            throw new BusinessException(404, "管理员不存在");
        }

        if (!BCrypt.checkpw(request.getOldPassword(), admin.getPassword())) {
            throw new BusinessException(400, "原密码错误");
        }

        String newPasswordHash = BCrypt.hashpw(request.getNewPassword(), BCrypt.gensalt());
        admin.setPassword(newPasswordHash);
        this.updateById(admin);
    }
}
