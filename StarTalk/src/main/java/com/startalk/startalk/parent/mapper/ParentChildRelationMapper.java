package com.startalk.startalk.parent.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.startalk.startalk.parent.entity.ParentChildRelation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ParentChildRelationMapper extends BaseMapper<ParentChildRelation> {

    List<ParentChildRelation> selectByParentId(@Param("parentId") Long parentId);

    ParentChildRelation selectByParentIdAndChildId(@Param("parentId") Long parentId, @Param("childId") Long childId);
}