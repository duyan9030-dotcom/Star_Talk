package com.startalk.startalk.word.controller;

import com.startalk.startalk.word.service.WordService;
import com.startalk.startalk.word.vo.WordStudyRequest;
import com.startalk.startalk.word.vo.WordTestQuestion;
import com.startalk.startalk.word.vo.WordVO;
import com.startalk.startalk.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/word")
public class WordController {

    @Autowired
    private WordService wordService;

    @GetMapping("/list")
    public Result<List<WordVO>> getWordList(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer difficulty) {
        return Result.success(wordService.getWordList(category, difficulty));
    }

    @GetMapping("/{wordId}")
    public Result<WordVO> getWordById(@PathVariable Long wordId) {
        return Result.success(wordService.getWordById(wordId));
    }

    @PostMapping("/study")
    public Result<WordVO> recordStudy(@RequestBody WordStudyRequest request, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        return Result.success(wordService.recordStudy(userId, request));
    }

    @GetMapping("/favorites")
    public Result<List<WordVO>> getFavoriteWords(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(wordService.getFavoriteWords(userId));
    }

    @PostMapping("/favorite/{wordId}")
    public Result<Void> addFavorite(@PathVariable Long wordId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        wordService.addFavorite(userId, wordId);
        return Result.success();
    }

    @DeleteMapping("/favorite/{wordId}")
    public Result<Void> removeFavorite(@PathVariable Long wordId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        wordService.removeFavorite(userId, wordId);
        return Result.success();
    }

    @GetMapping("/test/questions")
    public Result<List<WordTestQuestion>> getTestQuestions(
            @RequestParam(defaultValue = "10") Integer count,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(wordService.getTestQuestions(userId, count));
    }

    @PostMapping("/test/submit")
    public Result<Integer> submitTest(@RequestBody List<WordTestQuestion> answers, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(wordService.submitTest(userId, answers));
    }
}