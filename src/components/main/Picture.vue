<template>
    <div>
        <el-input placeholder="请输入内容" v-model="table.searchWord" @change="searchWordChange" class="input-with-select" :clearable="true" size="lage">
            <el-select v-model="table.searchType" @change="searchTypeChange" slot="prepend" placeholder="请选择" class="search-select">
                <el-option label="图片ID" value="id"></el-option>
                <el-option label="排序" value="position"></el-option>
                <el-option label="图片链接" value="url"></el-option>
            </el-select>
            <el-button @click="searchTypeChange" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-table :data="tableData" @sort-change="sortChange" size="medium" v-loading="tableLoading" :default-sort="{prop: 'position'}" border style="width: 100%">
            <el-table-column prop="id" label="ID" sortable="custom" width="70px">
            </el-table-column>
            <el-table-column prop="chapterid" label="章节ID" sortable="custom" width="120px">
            </el-table-column>
            <el-table-column prop="url" label="图片" width="90px">
                <template slot-scope="scope">
                    <img @click="$imageShow.show(scope.row.url)" class="picture-image" :src="scope.row.url + '@!h70'">
                </template>
            </el-table-column>
            <el-table-column prop="width" label="宽" sortable="custom">
            </el-table-column>
            <el-table-column prop="height" label="高" sortable="custom">
            </el-table-column>
            <el-table-column prop="position" label="排序" sortable="custom">
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间" sortable="custom">
            </el-table-column>
            <el-table-column prop="updatetime" label="修改时间" sortable="custom">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="editRow(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="pageChange" :page-size="table.pageSize" layout="prev, pager, next, jumper" :total="table.count" background>
        </el-pagination>
        <el-dialog title="漫画信息" :visible.sync="showEditDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" top="8vh">
            <el-form :model="form" size="medium" label-width="70px">
                <el-form-item label="图片ID">
                    <el-input :value="form.id" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="章节ID">
                    <el-input :value="form.chapterid" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="图片" style="text-align:left">
                    <img @click="$imageShow.show(form.url)" class="picture-image" :src="form.url + '@!h70'">
                    <form class="file-form">
                        <input id="file" class="file" type="file" @change="fileupload($event)">
                        <el-button @click="fileclick" size="mini" icon="el-icon-picture" :loading="fileUploading">上传文件</el-button>
                    </form>
                </el-form-item>
                <el-form-item label="宽度">
                    <el-input-number v-model="form.width" style="width:100%" :min="0" disabled></el-input-number>
                </el-form-item>
                <el-form-item label="高度">
                    <el-input-number v-model="form.height" style="width:100%" :min="0" disabled></el-input-number>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.position" style="width:100%" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button @click="editPicture" type="primary" :loading="fileUploading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Picture",
    data() {
        return {
            showEditDialog: false,
            tableData: [],
            tableLoading: false,
            fileUploading: false,
            form: {
                id: "",
                chapterid: "",
                url: "",
                width: "",
                height: "",
                position: 0
            },
            table: {
                count: 0,
                currentPage: 1,
                pageSize: 7,
                orderby: "position",
                sort: "ASC",
                searchWord: "",
                searchType: "id",
                chapterid: this.$route.params.chapterid
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
        editRow: function(index, picture) {
            this.form = this.$lodash.cloneDeep(picture);
            this.showEditDialog = true;
        },
        loadTable: function() {
            let that = this;
            that.tableLoading = true;
            that.$api
                .get("opus/getpicture", that.table)
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
                        that.form.url = data;
                        that.file = "";
                        let img = new Image();
                        img.src = data;
                        img.onload = function() {
                            console.info(img.width, img.height);
                            that.form.width = img.width;
                            that.form.height = img.height;
                            that.fileUploading = false;
                        };
                    })
                    .catch(function() {
                        that.$errorHandle.apply(null, arguments);
                        that.fileUploading = false;
                    });
            }
        },
        fileclick: function() {
            document.getElementById("file").click();
        },
        editPicture: function() {
            let that = this;
            that.$api
                .post("opus/updatepicture", that.form)
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
.picture-image {
    height: 70px;
    border: 1px solid #000;
    vertical-align: middle;
    cursor: pointer;
}
.summary-wrapper {
    cursor: pointer;
}
.picture-image-upload {
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

