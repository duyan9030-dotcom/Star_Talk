package com.startalk.startalk.admin.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.startalk.startalk.admin.entity.SystemSetting;
import com.startalk.startalk.admin.mapper.SystemSettingMapper;
import com.startalk.startalk.admin.vo.SystemSettingVO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminSystemService extends ServiceImpl<SystemSettingMapper, SystemSetting> {

    public List<SystemSettingVO> getSettingList(String group) {
        var queryWrapper = this.lambdaQuery()
                .eq(group != null && !group.isEmpty(), SystemSetting::getGroup, group)
                .orderByAsc(SystemSetting::getSort)
                .getWrapper();

        return this.list(queryWrapper).stream()
                .map(this::convertToSettingVO)
                .collect(Collectors.toList());
    }

    public void saveSetting(Long id, String value) {
        SystemSetting setting = this.getById(id);
        if (setting == null) {
            throw new RuntimeException("设置不存在");
        }
        setting.setSettingValue(value);
        this.updateById(setting);
    }

    public void batchSaveSettings(Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            var list = this.lambdaQuery()
                    .eq(SystemSetting::getSettingKey, entry.getKey())
                    .list();

            if (!list.isEmpty()) {
                SystemSetting setting = list.get(0);
                setting.setSettingValue(entry.getValue());
                this.updateById(setting);
            }
        }
    }

    public void createSetting(SystemSetting setting) {
        this.save(setting);
    }

    public void updateSetting(Long id, SystemSetting setting) {
        setting.setId(id);
        this.updateById(setting);
    }

    public void deleteSetting(Long id) {
        this.removeById(id);
    }

    private SystemSettingVO convertToSettingVO(SystemSetting setting) {
        SystemSettingVO vo = new SystemSettingVO();
        vo.setId(setting.getId());
        vo.setSettingKey(setting.getSettingKey());
        vo.setSettingValue(setting.getSettingValue());
        vo.setDescription(setting.getDescription());
        vo.setGroup(setting.getGroup());
        vo.setSort(setting.getSort());
        return vo;
    }
}
