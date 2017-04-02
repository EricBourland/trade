app.register("Table", [function() {
    return Table;

    function Table(columns) {
        this.draw = draw;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        const lineHeight = 20;

        let columnWidths = null;
        let freeSpace, spaceBetweenColumns, totalColumnWidths, columnOffsets;

        function draw(context, rows) {
            if (columnWidths === null) {
                columnWidths = columns.map(c => context.measureText(c.title).width);
                totalColumnWidths = columnWidths.reduce((c1, c2) => c1 + c2, 0);
                freeSpace = this.width - totalColumnWidths;
                spaceBetweenColumns = freeSpace / (columns.length - 1);
                columnOffsets = [];
                let offsetX = this.x;
                for (let width of columnWidths){
                    columnOffsets.push(offsetX);
                    offsetX += width + spaceBetweenColumns;
                }
            }
            
            let offsetY = this.y + lineHeight;
            for (let i = 0; i < columns.length; i++) {
                let column = columns[i];
                let width = columnWidths[i];
                let offsetX = columnOffsets[i];
                context.fillText(column.title, offsetX, offsetY);
            }

            context.beginPath();
            context.moveTo(this.x, offsetY + 6);
            context.lineTo(this.x + this.width, offsetY + 6);
            context.strokeStyle = "#888";
            context.stroke();

            offsetY = this.y + 2 * lineHeight + 5;
            for (let row of rows) {
                for (var i = 0; i < columns.length; i++) {
                    const column = columns[i];
                    const offsetX = columnOffsets[i];
                    let value;
                    if (typeof column.value === "string"){
                        value = row[column.value];
                    }
                    else {
                        value = column.value(row);
                    }
                    context.fillText(value, offsetX, offsetY);
                }
                offsetY += lineHeight;
            }
        }

    }
}]);