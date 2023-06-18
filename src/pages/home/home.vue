<template>
    <div class="home-wrapper">
        <el-upload
            class="upload-demo"
            drag
            action="/"
            :file-list="fileList1"
            :on-change="handleChange1"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将《人员名单》文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传xls、xlsx文件</div>
        </el-upload>
        <el-upload
            class="upload-demo"
            drag
            action="/"
            :file-list="fileList2"
            :on-change="handleChange2"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将《日安排》文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传xls、xlsx文件</div>
        </el-upload>
        <el-button type="primary" @click="download">下载文件</el-button>
    </div>
</template>

<script>
import * as XLSX from "xlsx";
import {
    workbook2blob,
    openDownloadDialog,
    file2Xce,
} from "../../utils/exceldown";

export default {
    props: {},
    data() {
        return {
            fileList1: [],
            fileList2: [],
            xlsxJson1: [],
            xlsxJson2: [],
        };
    },
    created() {},
    watch: {},
    components: {},
    mounted() {},
    computed: {},
    methods: {
        handleChange1(file) {
            const index = file.name.lastIndexOf(".");
            const types = file.name.slice(index + 1); // 获取文件后缀类型
            const fileType = ["xlsx", "xls"].some((item) => item === types);
            if (!fileType) {
                this.$message("格式错误！请重新选择");
                return;
            }
            this.fileList1 = [file];
            file2Xce(file).then((tabJson) => {
                // 辅助函数 file2Xce
                if (tabJson && tabJson.length > 0) {
                    //成功解析出数据
                    this.xlsxJson1 = tabJson;
                }
            });
        },
        handleChange2(file) {
            const index = file.name.lastIndexOf(".");
            const types = file.name.slice(index + 1); // 获取文件后缀类型
            const fileType = ["xlsx", "xls"].some((item) => item === types);
            if (!fileType) {
                this.$message("格式错误！请重新选择");
                return;
            }
            this.fileList2 = [file];
            file2Xce(file).then((tabJson) => {
                // 辅助函数 file2Xce
                if (tabJson && tabJson.length > 0) {
                    //成功解析出数据
                    this.xlsxJson2 = tabJson;
                }
            });
        },
        // 两个文件的json数据处理
        handleXlsxJson(xlsxJson1, xlsxJson2) {
            let fileData1 = [];
            xlsxJson1.forEach((item) => {
                fileData1 = fileData1.concat(item.sheet);
            });
            xlsxJson2.push({
                sheetName: "合计人数",
                sheet: [],
            });
            const totalData = xlsxJson2[1].sheet;
            const fileData2 = xlsxJson2[0].sheet;
            for (const row2 of fileData2) {
                // 合计人数表每行数据的结构
                const date = row2["计划开工时间"].slice(0, 10);
                let row1;
                let flag = false;
                for (const totalItem of totalData) {
                    if (totalItem["日期"] === date) {
                        row1 = totalItem;
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    row1 = {};
                    row1["日期"] = date;
                    row1["一班"] = [];
                    row1["一班数量"] = 0;
                    row1["二班"] = [];
                    row1["二班数量"] = 0;
                    row1["三班"] = [];
                    row1["三班数量"] = 0;
                    row1["四班"] = [];
                    row1["四班数量"] = 0;
                    row1["试验"] = [];
                    row1["试验数量"] = 0;
                    row1["保护"] = [];
                    row1["保护数量"] = 0;
                    row1["分超能"] = [];
                    row1["分超能数量"] = 0;
                    row1["外聘"] = [];
                    row1["外聘数量"] = 0;
                    totalData.push(row1);
                }
                // 日安排表每行数据的结构
                row2["一班"] = [];
                row2["一班数量"] = 0;
                row2["二班"] = [];
                row2["二班数量"] = 0;
                row2["三班"] = [];
                row2["三班数量"] = 0;
                row2["四班"] = [];
                row2["四班数量"] = 0;
                row2["试验"] = [];
                row2["试验数量"] = 0;
                row2["保护"] = [];
                row2["保护数量"] = 0;
                row2["分超能"] = [];
                row2["分超能数量"] = 0;
                row2["外聘"] = [];
                row2["外聘数量"] = 0;
                const group = row2["工作负责人（施工负责人）"]
                    .split(",")
                    .concat(row2["工作组成员"].split(","));
                group.forEach((person) => {
                    let flag = false;
                    for (const item of fileData1) {
                        if (item["姓名"] === person) {
                            if (item["部门/班组"] === "变电一次检修一班") {
                                row2["一班"].push(person);
                                row1["一班"].indexOf(person) === -1 &&
                                    row1["一班"].push(person);
                            } else if (
                                item["部门/班组"] === "变电一次检修二班"
                            ) {
                                row2["二班"].push(person);
                                row1["二班"].indexOf(person) === -1 &&
                                    row1["二班"].push(person);
                            } else if (
                                item["部门/班组"] === "变电一次检修三班"
                            ) {
                                row2["三班"].push(person);
                                row1["三班"].indexOf(person) === -1 &&
                                    row1["三班"].push(person);
                            } else if (
                                item["部门/班组"] === "变电一次检修四班"
                            ) {
                                row2["四班"].push(person);
                                row1["四班"].indexOf(person) === -1 &&
                                    row1["四班"].push(person);
                            } else if (item["部门/班组"] === "电气试验班") {
                                row2["试验"].push(person);
                                row1["试验"].indexOf(person) === -1 &&
                                    row1["试验"].push(person);
                            } else if (
                                item["部门/班组"].indexOf("变电二次检修") !== -1
                            ) {
                                row2["保护"].push(person);
                                row1["保护"].indexOf(person) === -1 &&
                                    row1["保护"].push(person);
                            } else if (item["部门/班组"] === "分超能") {
                                row2["分超能"].push(person);
                                row1["分超能"].indexOf(person) === -1 &&
                                    row1["分超能"].push(person);
                            }
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        row2["外聘"].push(person);
                        row1["外聘"].indexOf(person) === -1 &&
                            row1["外聘"].push(person);
                    }
                });
            }
            for (const item0 of xlsxJson2[0].sheet) {
                item0["一班数量"] = item0["一班"].length;
                item0["一班"] = item0["一班"].join(",");
                item0["二班数量"] = item0["二班"].length;
                item0["二班"] = item0["二班"].join(",");
                item0["三班数量"] = item0["三班"].length;
                item0["三班"] = item0["三班"].join(",");
                item0["四班数量"] = item0["四班"].length;
                item0["四班"] = item0["四班"].join(",");
                item0["试验数量"] = item0["试验"].length;
                item0["试验"] = item0["试验"].join(",");
                item0["保护数量"] = item0["保护"].length;
                item0["保护"] = item0["保护"].join(",");
                item0["分超能数量"] = item0["分超能"].length;
                item0["分超能"] = item0["分超能"].join(",");
                item0["外聘数量"] = item0["外聘"].length;
                item0["外聘"] = item0["外聘"].join(",");
            }
            for (const item1 of xlsxJson2[1].sheet) {
                item1["一班数量"] = item1["一班"].length;
                item1["一班"] = item1["一班"].join(",");
                item1["二班数量"] = item1["二班"].length;
                item1["二班"] = item1["二班"].join(",");
                item1["三班数量"] = item1["三班"].length;
                item1["三班"] = item1["三班"].join(",");
                item1["四班数量"] = item1["四班"].length;
                item1["四班"] = item1["四班"].join(",");
                item1["试验数量"] = item1["试验"].length;
                item1["试验"] = item1["试验"].join(",");
                item1["保护数量"] = item1["保护"].length;
                item1["保护"] = item1["保护"].join(",");
                item1["分超能数量"] = item1["分超能"].length;
                item1["分超能"] = item1["分超能"].join(",");
                item1["外聘数量"] = item1["外聘"].length;
                item1["外聘"] = item1["外聘"].join(",");
            }
        },
        download(e) {
            this.handleXlsxJson(this.xlsxJson1, this.xlsxJson2);
            // 转换sheet格式
            var sheet1 = XLSX.utils.json_to_sheet(this.xlsxJson2[0].sheet);
            var sheet2 = XLSX.utils.json_to_sheet(this.xlsxJson2[1].sheet);
            // var sheet2 = XLSX.utils.json_to_sheet(sheet2data); // 需要将每个sheet添加该步操作
            // 创建一个新的空的workbook
            var wb = XLSX.utils.book_new();
            // 为每一个工作簿设置名称并添加到workbook（excel表）中
            XLSX.utils.book_append_sheet(
                wb,
                sheet1,
                this.xlsxJson2[0].sheetName
            );
            XLSX.utils.book_append_sheet(
                wb,
                sheet2,
                this.xlsxJson2[1].sheetName
            );
            // XLSX.utils.book_append_sheet(wb, sheet2, "部门所属信息");
            const workbookBlob = workbook2blob(wb); // 辅助函数workbook2blob
            // 下载文档并添加文件名称
            openDownloadDialog(workbookBlob, "日安排.xlsx"); // 辅助函数openDownloadDialog
        },
    },
    beforeDestroy() {},
    destroyed() {},
};
</script>

<style lang="less" src="./home.less" scoped></style>