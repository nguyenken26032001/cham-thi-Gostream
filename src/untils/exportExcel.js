import ExcelJS from 'exceljs';
const exportFileExcel = (data) => {
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    // Tạo một worksheet trong workbook
    const number_teams = data.teams.length;
    data.teams.forEach((team) => {
        const worksheet = workbook.addWorksheet(`kết quả ${team.name}`);
        worksheet.getCell('A2').value = 'SỞ KHOA HỌC VÀ CÔNG NGHỆ';
        worksheet.getCell('A2').alignment = { horizontal: 'center' };
        worksheet.mergeCells('A2:B2');
        worksheet.getColumn('B').width = 32.27;
        worksheet.getCell('C2').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
        worksheet.mergeCells('C2:E2');
        worksheet.getCell('C2').alignment = { horizontal: 'center' };
        worksheet.getCell('A3').value = 'HỘI ĐỒNG CHUNG KHẢO';
        worksheet.mergeCells('A3:B3');
        worksheet.getCell('A3').font = {
            bold: true,
            size: 14
        };
        worksheet.getCell('A3').alignment = { horizontal: 'center' };
        worksheet.getCell('C3').value = 'Độc lập - Tự do - Hạnh phúc';
        worksheet.mergeCells('C3:E3');
        worksheet.getCell('C3').font = {
            bold: true,
            underline: true
        };
        worksheet.getCell('C3').alignment = { horizontal: 'center' };
        worksheet.getCell('B6').value = 'PHIẾU CHẤM ĐIỂM';
        worksheet.mergeCells('B6:D6');
        worksheet.getCell('B6').font = {
            bold: true,
            size: 18
        };
        worksheet.getCell('B6').alignment = { horizontal: 'center' };
        worksheet.getColumn('B').width = 32.27;
        worksheet.getCell('A8').value = `Tên dự án : ${team.name}`;
        worksheet.getCell('A9').value = `Thành viên hội đồng : `;
        worksheet.getCell('A10').value = `Chức danh trong hội đồng : Người chấm thi`;
        worksheet.getCell('A12').value = `STT`;
        worksheet.getCell('A12').font = {
            bold: true
        };
        worksheet.getCell('A12').style = {
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };
        worksheet.getCell('A12').alignment = { horizontal: 'center' };
        worksheet.getCell('B12').value = `Tiêu chí`;
        worksheet.getCell('B12').font = {
            bold: true
        };
        worksheet.getCell('B12').style = {
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };
        worksheet.getCell('B12').alignment = { horizontal: 'center' };
        var row_end = 0;
        team.rounds.forEach((_round, columIndex) => {
            worksheet.getCell('A9').value += `${_round.examiner}; `;
            worksheet.getRow(12).getCell(columIndex + 3).value = `${_round.examiner}`;
            worksheet.getRow(12).getCell(columIndex + 3).style = {
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            };
            worksheet.getColumn(columIndex + 3).width = worksheet.getRow(12).getCell(columIndex + 3).value.length + 1;
            worksheet.getRow(12).getCell(columIndex + 3).font = {
                bold: true
            };
            _round.marks.forEach((tieu_chi, index) => {
                const index_fixed = 13;
                var column_Index = index + index_fixed;
                worksheet.getCell(`A${column_Index}`).value = index + 1;
                worksheet.getCell(`A${column_Index}`).style = {
                    alignment: { wrapText: true },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                };
                worksheet.getCell(`B${column_Index}`).value = `${tieu_chi.name}`;
                worksheet.getCell(`B${column_Index}`).style = {
                    alignment: { wrapText: true },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                };
                worksheet.getRow(column_Index).getCell(columIndex + 3).value = `${tieu_chi.marks}`;
                worksheet.getRow(column_Index).getCell(columIndex + 3).style = {
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                };
                row_end = column_Index;
            });
        });
        worksheet.getRow(row_end + 3).getCell(3).value = 'Nghệ An, ngày…….tháng …….năm 20......';
        worksheet.getRow(row_end + 3).getCell(3).font = {
            italic: true
        };
        worksheet.getRow(row_end + 4).getCell(3).value = 'Thành viên Hội đồng';
        worksheet.getRow(row_end + 4).getCell(3).font = {
            bold: true,
            size: 14
        };
    });
    // Xuất workbook thành file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
};
export { exportFileExcel };
