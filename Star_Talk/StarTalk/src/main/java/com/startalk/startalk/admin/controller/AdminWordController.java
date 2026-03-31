package com.startalk.startalk.admin.controller;

import com.startalk.startalk.admin.service.AdminWordService;
import com.startalk.startalk.admin.vo.PageVO;
import com.startalk.startalk.admin.vo.WordVO;
import com.startalk.startalk.vo.Result;
import com.startalk.startalk.word.entity.Word;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/word")
public class AdminWordController {

    private final AdminWordService adminWordService;

    public AdminWordController(AdminWordService adminWordService) {
        this.adminWordService = adminWordService;
    }

    @GetMapping("/list")
    public Result<PageVO<WordVO>> getWordList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer difficulty,
            @RequestParam(required = false) String keyword) {
        return Result.success(adminWordService.getWordList(pageNum, pageSize, category, difficulty, keyword));
    }

    @GetMapping("/{id}")
    public Result<WordVO> getWordDetail(@PathVariable Long id) {
        return Result.success(adminWordService.getWordDetail(id));
    }

    @PostMapping
    public Result<Void> createWord(@RequestBody Word word) {
        adminWordService.createWord(word);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> updateWord(@PathVariable Long id, @RequestBody Word word) {
        adminWordService.updateWord(id, word);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteWord(@PathVariable Long id) {
        adminWordService.deleteWord(id);
        return Result.success();
    }
}
