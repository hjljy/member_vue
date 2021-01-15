<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="用户列表" ></el-alert>
    <el-button
          style="text-align: center;"
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="levelName" label="会员名称" > </el-table-column>
      <el-table-column prop="levelOrder" label="会员等级" > </el-table-column>
      <el-table-column prop="upgradeGrowthValue" label="所需成长值"> </el-table-column>
      <el-table-column prop="createTime" label="创建日期"> </el-table-column>
      <el-table-column prop="status" label="状态" > </el-table-column>
      <el-table-column prop="_memberDefault" label="会员默认等级" > </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          type="text"
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="text"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>
