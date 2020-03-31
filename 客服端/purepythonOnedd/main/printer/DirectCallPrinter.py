# -*- coding: utf-8 -*-
from PyQt5.QtCore import *
from PyQt5.QtGui import *
"""
直接打印,不预览
"""

from PyQt5.QtPrintSupport import QPrinterInfo, QPrinter

class Printer:

    #  打印机列表
    @staticmethod
    def printerList():
        printer = []
        printerInfo = QPrinterInfo()
        print('availablePrinterNames', printerInfo.availablePrinterNames())
        print('defaultPrinterName', printerInfo.defaultPrinterName())

        for item in printerInfo.availablePrinters():
            printer.append(item.printerName())
            return printer


    #  打印任务
    @staticmethod
    def printing(printer, context):
        p = QPrinter()
        doc = QTextDocument()

        htmlStr = context
        print('aaaa', htmlStr)
        doc.setHtml(htmlStr)
        doc.setPageSize(QSizeF(p.logicalDpiX() * (80 / 25.4),
                               p.logicalDpiY() * (297 / 25.4)))
        p.setOutputFormat(QPrinter.NativeFormat)
        doc.print_(p)


    @staticmethod
    def printing_22(printer, context):
        printerInfo = QPrinterInfo()
        p = QPrinter()
        for item in printerInfo.availablePrinters():
            if printer == item.printerName():
                p = QPrinter(item)
        doc = QTextDocument()
        doc.setHtml(u'%s' % context)
        doc.setPageSize(QSizeF(p.logicalDpiX() * (80 / 25.4),p.logicalDpiY() * (297 / 25.4)))
        p.setOutputFormat(QPrinter.NativeFormat)
        doc.print_(p)

if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication

    app = QApplication(sys.argv)
    ##########################################
    html = '<html><head></head><body><h1>55555</h1><b>bold</b></body></html>'
    p = "defaultPrinter"  # 打印机名称
    # Printer.printing(p, html)
    # Printer.printerList()
    Printer.printing_22(p, html)

    #####################################################
    sys.exit(app.exec_())