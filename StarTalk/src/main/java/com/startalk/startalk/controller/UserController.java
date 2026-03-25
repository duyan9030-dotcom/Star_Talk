package com.startalk.startalk.controller;

import com.startalk.startalk.entity.User;
import com.startalk.startalk.enums.UserRole;
import com.startalk.startalk.service.UserService;
import com.startalk.startalk.vo.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public Result<UserVO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return Result.success(convertToUserVO(user));
    }

    @PutMapping("/update")
    public Result<UserVO> updateUserInfo(@RequestBody UserVO userVO) {
        User user = userService.updateUserInfo(userVO);
        return Result.success(convertToUserVO(user));
    }

    @PutMapping("/switchRole/{userId}")
    public Result<UserVO> switchRole(@PathVariable Long userId, @RequestParam String role) {
        User user = userService.switchRole(userId, UserRole.fromCode(role));
        return Result.success(convertToUserVO(user));
    }

    private UserVO convertToUserVO(User user) {
        if (user == null) {
            return null;
        }
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setOpenid(user.getOpenid());
        vo.setUnionid(user.getUnionid());
        vo.setPhone(user.getPhone());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setAge(user.getAge());
        vo.setGrade(user.getGrade());
        vo.setRole(user.getRole());
        vo.setStatus(user.getStatus());
        return vo;
    }
}