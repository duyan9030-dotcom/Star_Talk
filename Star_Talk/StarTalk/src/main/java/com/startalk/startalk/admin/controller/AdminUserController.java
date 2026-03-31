package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.service.AdminUserService;
import com.startalk.startalk.admin.vo.PageVO;
import com.startalk.startalk.admin.vo.UserListVO;
import com.startalk.startalk.vo.Result;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping("/list")
    public Result<PageVO<UserListVO>> getUserList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        return Result.success(adminUserService.getUserList(pageNum, pageSize, role, status, keyword));
    }

    @GetMapping("/{id}")
    public Result<UserListVO> getUserDetail(@PathVariable Long id) {
        return Result.success(adminUserService.getUserDetail(id));
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateUserStatus(@PathVariable Long id, @RequestParam Integer status) {
        adminUserService.updateUserStatus(id, status);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return Result.success();
    }
}
