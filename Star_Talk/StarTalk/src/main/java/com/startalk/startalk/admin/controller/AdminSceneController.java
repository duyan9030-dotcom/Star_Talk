package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.service.AdminSceneService;
import com.startalk.startalk.admin.vo.PageVO;
import com.startalk.startalk.admin.vo.SceneVO;
import com.startalk.startalk.conversation.entity.ConversationScene;
import com.startalk.startalk.vo.Result;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/scene")
public class AdminSceneController {

    private final AdminSceneService adminSceneService;

    public AdminSceneController(AdminSceneService adminSceneService) {
        this.adminSceneService = adminSceneService;
    }

    @GetMapping("/list")
    public Result<PageVO<SceneVO>> getSceneList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        return Result.success(adminSceneService.getSceneList(pageNum, pageSize, keyword));
    }

    @GetMapping("/{id}")
    public Result<SceneVO> getSceneDetail(@PathVariable Long id) {
        return Result.success(adminSceneService.getSceneDetail(id));
    }

    @PostMapping
    public Result<Void> createScene(@RequestBody ConversationScene scene) {
        adminSceneService.createScene(scene);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> updateScene(@PathVariable Long id, @RequestBody ConversationScene scene) {
        adminSceneService.updateScene(id, scene);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteScene(@PathVariable Long id) {
        adminSceneService.deleteScene(id);
        return Result.success();
    }
}
