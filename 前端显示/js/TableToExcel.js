//自定定义一个用于记录导出信息的对像  
function TableToExcel(tableID) {
	this.tableBorder = -1; //边框类型，-1没有边框 可取1/2/3/4  
	this.backGround = 0; //背景颜色：白色 可取调色板中的颜色编号 1/2/3/4....  
	this.fontColor = 1; //字体颜色：黑色  
	this.fontSize = 10; //字体大小  
	this.fontStyle = "宋体"; //字体类型  
	this.rowHeight = 20; //行高  
	this.columnWidth = -1; //列宽  
	this.lineWrap = true; //是否自动换行  
	this.textAlign = -4108; //内容对齐方式 默认为居中  
	this.autoFit = true; //是否自适应宽度  
	this.tableID = tableID;
}
 
TableToExcel.prototype.setTableBorder = function(excelBorder) {
	this.tableBorder = excelBorder;
};
 
TableToExcel.prototype.setBackGround = function(excelColor) {
	this.backGround = excelColor;
};
 
TableToExcel.prototype.setFontColor = function(excelColor) {
	this.fontColor = excelColor;
};
 
TableToExcel.prototype.setFontSize = function(excelFontSize) {
	this.fontSize = excelFontSize;
};
 
TableToExcel.prototype.setFontStyle = function(excelFont) {
	this.fontStyle = excelFont;
};
 
TableToExcel.prototype.setRowHeight = function(excelRowHeight) {
	this.rowHeight = excelRowHeight;
};
 
TableToExcel.prototype.setColumnWidth = function(excelColumnWidth) {
	this.columnWidth = excelColumnWidth;
};
 
TableToExcel.prototype.isLineWrap = function(lineWrap) {
	if(lineWrap == false || lineWrap == true) {
		this.lineWrap = lineWrap;
	}
};
 
TableToExcel.prototype.setTextAlign = function(textAlign) {
	this.textAlign = textAlign;
};
 
TableToExcel.prototype.isAutoFit = function(autoFit) {
	if(autoFit == true || autoFit == false) this.autoFit = autoFit;
};
 
//文件转换主函数  
TableToExcel.prototype.getExcelFile = function() {
	//先声明Excel插件、Excel工作簿等对像  
	var jXls, myWorkbook, myWorksheet, myHTMLTableCell, myExcelCell, myExcelCell2;
	var myCellColSpan, myCellRowSpan;
	try {
		jXls = new ActiveXObject('Excel.Application'); //插件初始化失败时作出提示  
	} catch(e) {
		alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
		return false;
	}
	jXls.Visible = true;//这句写在这里可以看见整个EXCEL文档的加载过程  
	jXls.DisplayAlerts = false; //不显示警告    
 
	myWorkbook = jXls.Workbooks.Add(); //新建EXCEL文件  
	//myWorkbook.Worksheets(2).Delete(); //删除第3个标签页  
	//myWorkbook.Worksheets(3).Delete(); //删除第2个标签页  
 
	myWorksheet = myWorkbook.ActiveSheet; //获取当前活动的标签页  
 
	var readRow = 0,
		readCol = 0;
	var totalRow = 0,
		totalCol = 0;
	var tabNum = 0;
	//设置列宽  
	if(this.columnWidth != -1)
		myWorksheet.Columns.ColumnWidth = this.columnWidth;
	else
		myWorksheet.Columns.ColumnWidth = 7;
 
	//设置行高  
	if(this.rowHeight != -1)
		myWorksheet.Rows.RowHeight = this.rowHeight;
 
	//搜索需要转换的Table对象，获取对应行、列数  
	var obj = document.all.tags("table");
	for(var x = 0; x < obj.length; x++) {
		if(obj[x].id == this.tableID) {
			tabNum = x;
			totalRow = obj[x].rows.length; //记录总行数  
 
			//根据第一行的单元格数及各个单元格合并的格数来计算总列数  
			for(var i = 0; i < obj[x].rows[0].cells.length; i++) {
				myHTMLTableCell = obj[x].rows[0].cells(i);
				myCellColSpan = myHTMLTableCell.colSpan;
				totalCol = totalCol + myCellColSpan;
			}
		}
	}
 
	//开始根据总行数、总列数构件模拟表格  
	var excelTable = new Array();
	for(var i = 0; i <= totalRow; i++) {
		excelTable[i] = new Array();
		for(var t = 0; t <= totalCol; t++) {
			excelTable[i][t] = false;
		}
	}
 
	//开始转换表格   
	for(var z = 0; z < obj[tabNum].rows.length; z++) {
		readRow = z + 1;
		readCol = 0;
		for(var c = 0; c < obj[tabNum].rows(z).cells.length; c++) {
			myHTMLTableCell = obj[tabNum].rows(z).cells(c); //获取HTML表格单元格对像  
			myCellColSpan = myHTMLTableCell.colSpan; //获取单元格合并列数  
			myCellRowSpan = myHTMLTableCell.rowSpan; //获取单元格合并行数  
			for(var y = 1; y <= totalCol; y++) {
				if(excelTable[readRow][y] == false) {
					readCol = y;
					break;
				}
			}
			//合并行数*合并列数>0说明这一格有合并  
			if(myCellColSpan * myCellRowSpan > 1) {
				myExcelCell = myWorksheet.Cells(readRow, readCol); //定位单元格的起始格  
				myExcelCell2 = myWorksheet.Cells(readRow + myCellRowSpan - 1, readCol + myCellColSpan - 1); //定位单元格的结束格  
				myWorksheet.Range(myExcelCell, myExcelCell2).Merge(); //合并单元格  
				myExcelCell.HorizontalAlignment = this.textAlign; //设置对齐方式  
				myExcelCell.Font.Size = this.fontSize; //设置字体大小  
				myExcelCell.Font.Name = this.fontStyle; //设置字体样式  
				myExcelCell.Font.ColorIndex = this.fontColor; //设置字体颜色  
				myExcelCell.wrapText = this.lineWrap; //设置是否自动换行  
				myExcelCell.Interior.ColorIndex = this.backGround; //设置背景色  
				if(this.tableBorder != -1) { //设置边框  
					myWorksheet.Range(myExcelCell, myExcelCell2).Borders(1).Weight = this.tableBorder;
					myWorksheet.Range(myExcelCell, myExcelCell2).Borders(2).Weight = this.tableBorder;
					myWorksheet.Range(myExcelCell, myExcelCell2).Borders(3).Weight = this.tableBorder;
					myWorksheet.Range(myExcelCell, myExcelCell2).Borders(4).Weight = this.tableBorder;
				}
				myExcelCell.Value = myHTMLTableCell.innerText; //赋值  
				//将合并完的单元格设置为已赋值  
				for(var row = readRow; row <= myCellRowSpan + readRow - 1; row++) {
					for(var col = readCol; col <= myCellColSpan + readCol - 1; col++) {
						excelTable[row][col] = true;
					}
				}
				//定位下一个处理的单元格的列数   
				readCol = readCol + myCellColSpan;
			} else { //没有表格合并的处理情况  
				myExcelCell = myWorksheet.Cells(readRow, readCol);
				myExcelCell.Value = myHTMLTableCell.innerText;
				myExcelCell.HorizontalAlignment = this.textAlign;
				myExcelCell.Font.Size = this.fontSize;
				myExcelCell.Font.Name = this.fontStyle;
				myExcelCell.wrapText = this.lineWrap;
				myExcelCell.Interior.ColorIndex = this.backGround;
				myExcelCell.Font.ColorIndex = this.fontColor;
				if(this.tableBorder != -1) {
					myExcelCell.Borders(1).Weight = this.tableBorder;
					myExcelCell.Borders(2).Weight = this.tableBorder;
					myExcelCell.Borders(3).Weight = this.tableBorder;
					myExcelCell.Borders(4).Weight = this.tableBorder;
				}
				excelTable[readRow][readCol] = true;
				readCol = readCol + 1;
			}
		}
	}
 
	if(this.autoFit == true)
		myWorksheet.Columns.AutoFit;
	jXls.Visible = true; //显示Excel文件  
	jXls.UserControl = true;
	jXls = null; //释放对像  
	myWorkbook = null; //释放对像  
	myWorksheet = null; //释放对像  
};