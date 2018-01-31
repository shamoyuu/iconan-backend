<template>
    <div>
        <el-input placeholder="请输入内容" v-model="table.searchWord" @change="searchWordChange" class="input-with-select" :clearable="true" size="lage">
            <el-select v-model="table.searchType" @change="searchTypeChange" slot="prepend" placeholder="请选择" class="search-select">
                <el-option label="章节ID" value="id"></el-option>
                <el-option label="章节名" value="name"></el-option>
            </el-select>
            <el-button @click="searchTypeChange" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-table :data="tableData" @sort-change="sortChange" size="medium" v-loading="tableLoading" :default-sort="{prop: 'date', order: 'descending'}" border style="width: 100%">
            <el-table-column prop="id" label="ID" sortable="custom">
            </el-table-column>
            <el-table-column prop="opusid" label="漫画ID" sortable="custom">
            </el-table-column>
            <el-table-column prop="name" label="章节名" sortable="custom">
            </el-table-column>
            <el-table-column prop="position" label="排序" sortable="custom">
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间" sortable="custom">
            </el-table-column>
            <el-table-column prop="updatetime" label="修改时间" sortable="custom">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" @click="editRow(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
                        <el-button size="mini" @click="checkRow(scope.$index, scope.row)" icon="el-icon-view"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="pageChange" :page-size="table.pageSize" layout="prev, pager, next, jumper" :total="table.count" background>
        </el-pagination>
        <el-dialog title="章节信息" :visible.sync="showEditDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" top="8vh">
            <el-form :model="form" size="medium" label-width="70px">
                <el-form-item label="漫画ID">
                    <el-input :value="form.opusid" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="章节ID">
                    <el-input :value="form.id" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="章节名">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.position" style="width:100%" :min="0" :max="100"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button @click="editChapter" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Chapter",
    data() {
        return {
            showEditDialog: false,
            tableData: [],
            tableLoading: false,
            fileUploading: false,
            form: {
                id: "",
                opusid: "",
                name: "",
                position: ""
            },
            table: {
                count: 0,
                currentPage: 1,
                pageSize: 10,
                orderby: "",
                sort: "ASC",
                searchWord: "",
                searchType: "id",
                opusid: this.$route.params.opusid
            }
        };
    },
    methods: {
        searchTypeChange: function() {
            if (this.table.searchWord) {
                this.table.currentPage = 1;
                this.loadTable();
            }
        },
        searchWordChange: function(searchWord) {
            console.info("searchWordChange", arguments);
            this.table.currentPage = 1;
            this.table.searchWord = searchWord;
            this.loadTable();
        },
        sortChange: function(order) {
            console.info("sortChange", arguments);
            this.table.orderby = order.prop;
            this.table.sort = order.order == "ascending" ? "ASC" : "DESC";
            this.loadTable();
        },
        pageChange: function(currentPage) {
            console.info("pageChange", currentPage);
            this.table.currentPage = currentPage;
            this.loadTable();
        },
        editRow: function(index, chapter) {
            this.form = this.$lodash.cloneDeep(chapter);
            this.showEditDialog = true;
            console.info("editRow", arguments);
        },
        checkRow: function(index, chapter) {
            this.$router.push("/picture/" + chapter.id);
        },
        loadTable: function() {
            let that = this;
            that.tableLoading = true;
            that.$api
                .get("opus/getchapter", that.table)
                .then(function(data) {
                    that.tableData = data.list;
                    that.table.count = data.count;
                })
                .catch(this.$errorHandle)
                .finally(function() {
                    that.tableLoading = false;
                });
        },
        editChapter: function() {
            let that = this;
            that.$api
                .post("opus/updatechapter", that.form)
                .then(function() {
                    console.info("editChapter完成");
                    that.showEditDialog = false;
                    that.loadTable();
                })
                .catch(that.$errorHandle);
        }
    },
    mounted: function() {
        this.loadTable();
        console.info(this.$route.params.opusid);
    }
};
</script>

<style scoped>
.el-table {
    margin-top: 10px;
}
.search-select {
    width: 130px;
}
.cover-image {
    height: 70px;
    border: 1px solid #000;
    vertical-align: middle;
    cursor: pointer;
}
.summary-wrapper {
    cursor: pointer;
}
.cover-image-upload {
    display: inline-block;
    margin-left: 10px;
}
.file {
    display: none;
}
.file-form {
    display: inline-block;
}
</style>

