package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.service.AdminAuthService;
import com.startalk.startalk.admin.vo.AdminInfoVO;
import com.startalk.startalk.admin.vo.AdminLoginRequest;
import com.startalk.startalk.admin.vo.AdminLoginResponse;
import com.startalk.startalk.admin.vo.ChangePasswordRequest;
import com.startalk.startalk.vo.Result;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public Result<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        return Result.success(adminAuthService.login(request));
    }

    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        return Result.success();
    }

    @GetMapping("/info")
    public Result<AdminInfoVO> getInfo(HttpServletRequest request) {
        Long adminId = (Long) request.getAttribute("adminId");
        return Result.success(adminAuthService.getInfo(adminId));
    }

    @PutMapping("/password")
    public Result<Void> changePassword(HttpServletRequest request,
                                       @RequestBody ChangePasswordRequest passwordRequest) {
        Long adminId = (Long) request.getAttribute("adminId");
        adminAuthService.changePassword(adminId, passwordRequest);
        return Result.success();
    }
}
