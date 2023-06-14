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
                fileData1 = fileData1.concat(item.sheet.slice(1));
            });
            const fileHeader = xlsxJson2[0].sheet[0];
            fileHeader["__EMPTY_59"] = "一班";
            fileHeader["__EMPTY_60"] = "二班";
            fileHeader["__EMPTY_61"] = "三班";
            fileHeader["__EMPTY_62"] = "四班";
            fileHeader["__EMPTY_63"] = "试验";
            fileHeader["__EMPTY_64"] = "保护";
            fileHeader["__EMPTY_65"] = "分超能";
            fileHeader["__EMPTY_66"] = "外聘";
            const leaderKey = "__EMPTY_32"; // "工作负责人（施工负责人）"一栏
            const personKey = "__EMPTY_53"; // "工作组成员"一栏
            const fileData2 = xlsxJson2[0].sheet.slice(1);
            for (const row of fileData2) {
                const group = row[leaderKey]
                    .split(",")
                    .concat(row[personKey].split(","));
                group.forEach((person) => {
                    let flag = false;
                    for (const item of fileData1) {
                        if (item["姓名"] === person) {
                            if (item["部门/班组"] === "变电一次检修一班") {
                                row["__EMPTY_59"] = row["__EMPTY_59"]
                                    ? `${row["__EMPTY_59"]},${person}`
                                    : person;
                            } else if (
                                item["部门/班组"] === "变电一次检修二班"
                            ) {
                                row["__EMPTY_60"] = row["__EMPTY_60"]
                                    ? `${row["__EMPTY_60"]},${person}`
                                    : person;
                            } else if (
                                item["部门/班组"] === "变电一次检修三班"
                            ) {
                                row["__EMPTY_61"] = row["__EMPTY_61"]
                                    ? `${row["__EMPTY_61"]},${person}`
                                    : person;
                            } else if (
                                item["部门/班组"] === "变电一次检修四班"
                            ) {
                                row["__EMPTY_62"] = row["__EMPTY_62"]
                                    ? `${row["__EMPTY_62"]},${person}`
                                    : person;
                            } else if (item["部门/班组"] === "电气试验班") {
                                row["__EMPTY_63"] = row["__EMPTY_63"]
                                    ? `${row["__EMPTY_63"]},${person}`
                                    : person;
                            } else if (
                                item["部门/班组"].indexOf("变电二次检修") !== -1
                            ) {
                                row["__EMPTY_64"] = row["__EMPTY_64"]
                                    ? `${row["__EMPTY_64"]},${person}`
                                    : person;
                            }
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        row["__EMPTY_66"] = row["__EMPTY_66"]
                            ? `${row["__EMPTY_66"]},${person}`
                            : person;
                    }
                });
            }
        },
        download(e) {
            this.handleXlsxJson(this.xlsxJson1, this.xlsxJson2);
            // 转换sheet格式
            var sheet1 = XLSX.utils.json_to_sheet(this.xlsxJson2[0].sheet);
            // var sheet2 = XLSX.utils.json_to_sheet(sheet2data); // 需要将每个sheet添加该步操作
            // 创建一个新的空的workbook
            var wb = XLSX.utils.book_new();
            // 为每一个工作簿设置名称并添加到workbook（excel表）中
            XLSX.utils.book_append_sheet(wb, sheet1, "日安排");
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