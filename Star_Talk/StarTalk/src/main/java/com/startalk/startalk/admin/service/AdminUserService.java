package com.startalk.startalk.admin.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.startalk.startalk.admin.entity.WordCategory;
import com.startalk.startalk.admin.mapper.WordCategoryMapper;
import com.startalk.startalk.admin.vo.CategoryTreeVO;
import com.startalk.startalk.admin.vo.PageVO;
import com.startalk.startalk.admin.vo.UserListVO;
import com.startalk.startalk.admin.mapper.UserManageMapper;
import com.startalk.startalk.entity.User;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService extends ServiceImpl<UserManageMapper, User> {

    public PageVO<UserListVO> getUserList(Integer pageNum, Integer pageSize, String role, Integer status, String keyword) {
        Page<User> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        if (role != null && !role.isEmpty()) {
            wrapper.eq(User::getRole, role);
        }
        if (status != null) {
            wrapper.eq(User::getStatus, status);
        }
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(User::getNickname, keyword)
                           .or().like(User::getPhone, keyword));
        }

        wrapper.orderByDesc(User::getCreateTime);
        Page<User> result = this.page(page, wrapper);

        PageVO<UserListVO> pageVO = new PageVO<>();
        pageVO.setTotal(result.getTotal());
        pageVO.setRecords(result.getRecords().stream().map(this::convertToUserListVO).collect(Collectors.toList()));
        pageVO.setPageNum((long) pageNum);
        pageVO.setPageSize((long) pageSize);
        return pageVO;
    }

    public UserListVO getUserDetail(Long userId) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        return convertToUserListVO(user);
    }

    public void updateUserStatus(Long userId, Integer status) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        user.setStatus(status);
        this.updateById(user);
    }

    public void deleteUser(Long userId) {
        User user = this.getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        this.removeById(userId);
    }

    private UserListVO convertToUserListVO(User user) {
        UserListVO vo = new UserListVO();
        vo.setId(user.getId());
        vo.setPhone(user.getPhone());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setAge(user.getAge());
        vo.setGrade(user.getGrade());
        vo.setRole(user.getRole());
        vo.setStatus(user.getStatus());
        vo.setCreateTime(user.getCreateTime());
        return vo;
    }
}
