package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.entity.SystemSetting;
import com.startalk.startalk.admin.service.AdminSystemService;
import com.startalk.startalk.admin.vo.SystemSettingVO;
import com.startalk.startalk.vo.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/system/setting")
public class AdminSystemController {

    private final AdminSystemService adminSystemService;

    public AdminSystemController(AdminSystemService adminSystemService) {
        this.adminSystemService = adminSystemService;
    }

    @GetMapping("/list")
    public Result<List<SystemSettingVO>> getSettingList(@RequestParam(required = false) String group) {
        return Result.success(adminSystemService.getSettingList(group));
    }

    @PatchMapping("/{id}")
    public Result<Void> saveSetting(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String value = body.get("value");
        adminSystemService.saveSetting(id, value);
        return Result.success();
    }

    @PutMapping("/batch")
    public Result<Void> batchSaveSettings(@RequestBody Map<String, String> settings) {
        adminSystemService.batchSaveSettings(settings);
        return Result.success();
    }

    @PostMapping
    public Result<Void> createSetting(@RequestBody SystemSetting setting) {
        adminSystemService.createSetting(setting);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> updateSetting(@PathVariable Long id, @RequestBody SystemSetting setting) {
        adminSystemService.updateSetting(id, setting);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteSetting(@PathVariable Long id) {
        adminSystemService.deleteSetting(id);
        return Result.success();
    }
}
