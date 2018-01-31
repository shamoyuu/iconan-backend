<template>
    <div>
        <el-input placeholder="请输入内容" v-model="table.searchWord" @change="searchWordChange" class="input-with-select" :clearable="true" size="lage">
            <el-select v-model="table.searchType" @change="searchTypeChange" slot="prepend" placeholder="请选择" class="search-select">
                <el-option label="漫画ID" value="id"></el-option>
                <el-option label="漫画名" value="name"></el-option>
                <el-option label="漫画简介" value="summary"></el-option>
                <el-option label="封面" value="cover"></el-option>
            </el-select>
            <el-button @click="searchTypeChange" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-table :data="tableData" @sort-change="sortChange" size="medium" v-loading="tableLoading" :default-sort="{prop: 'date', order: 'descending'}" border style="width: 100%">
            <el-table-column prop="id" label="ID" sortable="custom" width="70px">
            </el-table-column>
            <el-table-column prop="name" label="漫画名" sortable="custom">
            </el-table-column>
            <el-table-column prop="author" label="作者" sortable="custom">
            </el-table-column>
            <el-table-column prop="cover" label="封面" width="90px">
                <template slot-scope="scope">
                    <img @click="$imageShow.show(scope.row.cover)" class="cover-image" :src="scope.row.cover + '@!h70'">
                </template>
            </el-table-column>
            <el-table-column prop="popularity" label="人气" sortable="custom">
            </el-table-column>
            <el-table-column prop="score" label="评分" sortable="custom">
            </el-table-column>
            <el-table-column prop="summary" label="简介">
                <template slot-scope="scope">
                    <el-popover trigger="click" placement="top" width="400">
                        <p>{{ scope.row.summary }}</p>
                        <div slot="reference" class="summary-wrapper">点击查看</div>
                    </el-popover>
                </template>
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
        <el-dialog title="漫画信息" :visible.sync="showEditDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" top="8vh">
            <el-form :model="form" size="medium" label-width="70px">
                <el-form-item label="漫画ID">
                    <el-input :value="form.id" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="漫画名">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="form.author" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="封面" style="text-align:left">
                    <img @click="$imageShow.show(form.cover)" class="cover-image" :src="form.cover + '@!h70'">
                    <form class="file-form">
                        <input id="file" class="file" type="file" @change="fileupload($event)">
                        <el-button @click="fileclick" size="mini" icon="el-icon-picture" :loading="fileUploading">上传文件</el-button>
                    </form>
                </el-form-item>
                <el-form-item label="人气">
                    <el-input-number v-model="form.popularity" style="width:100%" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="评分">
                    <el-input-number v-model="form.score" style="width:100%" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.summary">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button @click="editOpus" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Opus",
    data() {
        return {
            showEditDialog: false,
            tableData: [],
            tableLoading: false,
            fileUploading: false,
            form: {
                id: "",
                name: "",
                author: "",
                summary: "",
                popularity: 0,
                score: 100,
                cover: ""
            },
            table: {
                count: 0,
                currentPage: 1,
                pageSize: 7,
                orderby: "",
                sort: "ASC",
                searchWord: "",
                searchType: "id"
            },
            file: ""
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
            this.table.currentPage = 1;
            this.table.searchWord = searchWord;
            this.loadTable();
        },
        sortChange: function(order) {
            this.table.orderby = order.prop;
            this.table.sort = order.order == "ascending" ? "ASC" : "DESC";
            this.loadTable();
        },
        pageChange: function(currentPage) {
            this.table.currentPage = currentPage;
            this.loadTable();
        },
        editRow: function(index, opus) {
            this.form = this.$lodash.cloneDeep(opus);
            this.showEditDialog = true;
        },
        checkRow: function(index, opus) {
            this.$router.push("/chapter/" + opus.id);
        },
        loadTable: function() {
            let that = this;
            that.tableLoading = true;
            that.$api
                .get("opus/getopus", that.table)
                .then(function(data) {
                    that.tableData = data.list;
                    that.table.count = data.count;
                })
                .catch(this.$errorHandle)
                .finally(function() {
                    that.tableLoading = false;
                });
        },
        fileupload: function(event) {
            event.preventDefault();
            let that = this;
            that.file = event.target.files[0];
            if (that.file) {
                that.fileUploading = true;
                let formData = new FormData();
                formData.append("file", that.file);

                that.$api
                    .file("opus/upload", formData)
                    .then(function(data) {
                        that.form.cover = data;
                        that.file = "";
                    })
                    .catch(that.$errorHandle)
                    .finally(function() {
                        that.fileUploading = false;
                    });
            }
        },
        fileclick: function() {
            document.getElementById("file").click();
        },
        editOpus: function() {
            let that = this;
            that.$api
                .post("opus/updateopus", that.form)
                .then(function() {
                    that.showEditDialog = false;
                    that.loadTable();
                })
                .catch(that.$errorHandle);
        }
    },
    mounted: function() {
        this.loadTable();
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

