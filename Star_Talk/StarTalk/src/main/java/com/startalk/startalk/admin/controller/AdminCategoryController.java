package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.entity.WordCategory;
import com.startalk.startalk.admin.service.AdminCategoryService;
import com.startalk.startalk.admin.vo.CategoryTreeVO;
import com.startalk.startalk.vo.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/category")
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    public AdminCategoryController(AdminCategoryService adminCategoryService) {
        this.adminCategoryService = adminCategoryService;
    }

    @GetMapping("/tree")
    public Result<List<CategoryTreeVO>> getCategoryTree() {
        return Result.success(adminCategoryService.getCategoryTree());
    }

    @PostMapping
    public Result<Void> createCategory(@RequestBody WordCategory category) {
        adminCategoryService.createCategory(category);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> updateCategory(@PathVariable Long id, @RequestBody WordCategory category) {
        adminCategoryService.updateCategory(id, category);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        adminCategoryService.deleteCategory(id);
        return Result.success();
    }
}
