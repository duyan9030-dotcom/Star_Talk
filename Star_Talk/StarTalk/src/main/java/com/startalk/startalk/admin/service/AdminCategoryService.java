package com.startalk.startalk.admin.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.startalk.startalk.admin.mapper.WordCategoryMapper;
import com.startalk.startalk.admin.vo.CategoryTreeVO;
import com.startalk.startalk.admin.entity.WordCategory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminCategoryService extends ServiceImpl<WordCategoryMapper, WordCategory> {

    public List<CategoryTreeVO> getCategoryTree() {
        List<WordCategory> allCategories = this.lambdaQuery()
                .orderByAsc(WordCategory::getSort)
                .list();

        return buildTree(allCategories, 0L);
    }

    private List<CategoryTreeVO> buildTree(List<WordCategory> categories, Long parentId) {
        return categories.stream()
                .filter(c -> (c.getParentId() == null && parentId == 0L) ||
                            (c.getParentId() != null && c.getParentId().equals(parentId)))
                .map(c -> {
                    CategoryTreeVO vo = new CategoryTreeVO();
                    vo.setId(c.getId());
                    vo.setName(c.getName());
                    vo.setNameEn(c.getNameEn());
                    vo.setParentId(c.getParentId());
                    vo.setSort(c.getSort());
                    vo.setStatus(c.getStatus());
                    vo.setChildren(buildTree(categories, c.getId()));
                    return vo;
                })
                .collect(Collectors.toList());
    }

    public void createCategory(WordCategory category) {
        this.save(category);
    }

    public void updateCategory(Long id, WordCategory category) {
        WordCategory existing = this.getById(id);
        if (existing == null) {
            throw new RuntimeException("分类不存在");
        }
        category.setId(id);
        this.updateById(category);
    }

    public void deleteCategory(Long id) {
        long childCount = this.lambdaQuery()
                .eq(WordCategory::getParentId, id)
                .count();
        if (childCount > 0) {
            throw new RuntimeException("请先删除子分类");
        }
        this.removeById(id);
    }
}
