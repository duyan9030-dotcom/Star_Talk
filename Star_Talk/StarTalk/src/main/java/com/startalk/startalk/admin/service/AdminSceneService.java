package com.startalk.startalk.admin.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.startalk.startalk.admin.mapper.SceneManageMapper;
import com.startalk.startalk.admin.vo.PageVO;
import com.startalk.startalk.admin.vo.SceneVO;
import com.startalk.startalk.conversation.entity.ConversationScene;
import com.startalk.startalk.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class AdminSceneService extends ServiceImpl<SceneManageMapper, ConversationScene> {

    public PageVO<SceneVO> getSceneList(Integer pageNum, Integer pageSize, String keyword) {
        Page<ConversationScene> page = new Page<>(pageNum, pageSize);
        var wrapper = this.lambdaQuery()
                .like(keyword != null && !keyword.isEmpty(), ConversationScene::getName, keyword)
                .orderByAsc(ConversationScene::getSort)
                .getWrapper();

        Page<ConversationScene> result = this.page(page, wrapper);

        PageVO<SceneVO> pageVO = new PageVO<>();
        pageVO.setTotal(result.getTotal());
        pageVO.setRecords(result.getRecords().stream().map(this::convertToSceneVO).collect(Collectors.toList()));
        pageVO.setPageNum((long) pageNum);
        pageVO.setPageSize((long) pageSize);
        return pageVO;
    }

    public SceneVO getSceneDetail(Long sceneId) {
        ConversationScene scene = this.getById(sceneId);
        if (scene == null) {
            throw new BusinessException(404, "场景不存在");
        }
        return convertToSceneVO(scene);
    }

    public void createScene(ConversationScene scene) {
        this.save(scene);
    }

    public void updateScene(Long sceneId, ConversationScene scene) {
        ConversationScene existing = this.getById(sceneId);
        if (existing == null) {
            throw new BusinessException(404, "场景不存在");
        }
        scene.setId(sceneId);
        this.updateById(scene);
    }

    public void deleteScene(Long sceneId) {
        if (!this.removeById(sceneId)) {
            throw new BusinessException(404, "场景不存在");
        }
    }

    private SceneVO convertToSceneVO(ConversationScene scene) {
        SceneVO vo = new SceneVO();
        vo.setId(scene.getId());
        vo.setName(scene.getName());
        vo.setNameEn(scene.getNameEn());
        vo.setDescription(scene.getDescription());
        vo.setPrompt(scene.getPrompt());
        vo.setIcon(scene.getIcon());
        vo.setDifficulty(scene.getDifficulty());
        vo.setSort(scene.getSort());
        vo.setStatus(scene.getStatus());
        vo.setCreateTime(scene.getCreateTime());
        vo.setUpdateTime(scene.getUpdateTime());
        return vo;
    }
}
